import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminServiceRequests = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser || null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters & Search
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    fetchBookings();
  }, [propUser]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getservicebookings.php");
      if (Array.isArray(res.data)) {
        setBookings(res.data);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching service bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateservicestatus.php", {
        booking_id: bookingId,
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b.booking_id === bookingId ? { ...b, status: newStatus } : b))
      );
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status.");
    }
  };

  const handleDeleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this service request?")) return;

    try {
      await axios.post("https://abedhiggs.alwaysdata.net/sseapis/deleteservicebooking.php", {
        booking_id: bookingId,
      });
      setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
    } catch (err) {
      console.error("Error deleting booking:", err);
      alert("Failed to delete booking.");
    }
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="container py-5 text-center">
        <div className="alert alert-danger rounded-4 p-5 shadow-sm max-w-lg mx-auto">
          <i className="bi bi-shield-lock-fill display-3 d-block mb-3 text-danger"></i>
          <h3 className="fw-bold">Access Denied</h3>
          <p className="mb-0">You must be logged in as an Administrator to view service requests.</p>
        </div>
      </div>
    );
  }

  const filteredBookings = bookings.filter((b) => {
    const matchesStatus =
      statusFilter === "all" ? true : (b.status || "Pending").toLowerCase() === statusFilter.toLowerCase();
    
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      (b.username && b.username.toLowerCase().includes(searchLower)) ||
      (b.phone && b.phone.toLowerCase().includes(searchLower)) ||
      (b.location && b.location.toLowerCase().includes(searchLower)) ||
      (b.service_name && b.service_name.toLowerCase().includes(searchLower));

    return matchesStatus && matchesSearch;
  });

  const totalValue = bookings.reduce((sum, b) => sum + parseFloat(b.price || 0), 0);
  const pendingCount = bookings.filter((b) => (b.status || "Pending").toLowerCase() === "pending").length;

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <span className="badge bg-warning bg-opacity-10 text-warning fw-bold px-3 py-2 rounded-pill mb-2">
            <i className="bi bi-shield-lock me-1"></i> Admin Portal
          </span>
          <h2 className="fw-bold text-dark m-0">Computer Service Requests</h2>
          <p className="text-muted mb-0 small">
            Review and manage client service bookings &amp; repair schedules
          </p>
        </div>

        <button
          className="btn btn-outline-primary rounded-pill px-4 btn-sm align-self-start align-self-md-auto"
          onClick={fetchBookings}
        >
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh Requests
        </button>
      </div>

      {/* Stats Widgets */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-primary bg-opacity-10 text-primary">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-uppercase fw-bold opacity-75">Total Bookings</div>
                <div className="fs-3 fw-bold">{bookings.length}</div>
              </div>
              <i className="bi bi-calendar2-check fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-warning bg-opacity-10 text-warning">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-uppercase fw-bold opacity-75">Pending Action</div>
                <div className="fs-3 fw-bold">{pendingCount}</div>
              </div>
              <i className="bi bi-clock-history fs-1 opacity-50"></i>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card border-0 shadow-sm rounded-4 p-3 bg-success bg-opacity-10 text-success">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="small text-uppercase fw-bold opacity-75">Pipeline Value</div>
                <div className="fs-3 fw-bold">KSh {totalValue.toLocaleString()}</div>
              </div>
              <i className="bi bi-cash-stack fs-1 opacity-50"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Controls / Filter bar */}
      <div className="card border-0 shadow-sm rounded-4 p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-md-6">
            <div className="input-group">
              <span className="input-group-text bg-light border-0 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control bg-light border-0"
                placeholder="Search by client, phone, location, or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="col-md-6 d-flex gap-2 justify-content-md-end">
            {["all", "pending", "confirmed", "completed"].map((st) => (
              <button
                key={st}
                className={`btn btn-sm rounded-pill text-capitalize px-3 ${
                  statusFilter === st ? "btn-dark fw-bold" : "btn-light text-muted"
                }`}
                onClick={() => setStatusFilter(st)}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bookings Table / Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading service bookings...</p>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-light">
          <i className="bi bi-inbox display-4 text-muted mb-2"></i>
          <h5 className="text-secondary">No service bookings found.</h5>
        </div>
      ) : (
        <div className="table-responsive card border-0 shadow-sm rounded-4 overflow-hidden">
          <table className="table table-hover align-middle mb-0">
            <thead className="table-dark small text-uppercase">
              <tr>
                <th className="py-3 ps-4">Client Info</th>
                <th className="py-3">Service Requested</th>
                <th className="py-3">Scheduled Date</th>
                <th className="py-3">Location</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-end pe-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => {
                const currentStatus = b.status || "Pending";
                let statusBadgeClass = "bg-warning bg-opacity-10 text-warning";
                if (currentStatus.toLowerCase() === "confirmed")
                  statusBadgeClass = "bg-primary bg-opacity-10 text-primary";
                if (currentStatus.toLowerCase() === "completed")
                  statusBadgeClass = "bg-success bg-opacity-10 text-success";
                if (currentStatus.toLowerCase() === "cancelled")
                  statusBadgeClass = "bg-danger bg-opacity-10 text-danger";

                return (
                  <tr key={b.booking_id || b.id}>
                    <td className="ps-4">
                      <div className="fw-bold text-dark">{b.username || "Guest User"}</div>
                      <div className="small text-muted d-flex align-items-center gap-1">
                        <i className="bi bi-telephone text-primary"></i>
                        <a href={`tel:${b.phone}`} className="text-decoration-none text-muted">
                          {b.phone}
                        </a>
                      </div>
                    </td>

                    <td>
                      <span className="fw-semibold text-dark">{b.service_name}</span>
                      <div className="small text-success fw-bold">
                        KSh {parseFloat(b.price || 0).toLocaleString()}
                      </div>
                      {b.notes && (
                        <div
                          className="small text-muted mt-1 text-truncate"
                          style={{ maxWidth: "220px" }}
                          title={b.notes}
                        >
                          <i className="bi bi-chat-left-text me-1"></i>
                          {b.notes}
                        </div>
                      )}
                    </td>

                    <td>
                      <div className="small fw-semibold text-dark">
                        {b.service_date
                          ? new Date(b.service_date).toLocaleDateString(undefined, {
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "Not specified"}
                      </div>
                      <div className="small text-muted">
                        {b.service_date ? new Date(b.service_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                      </div>
                    </td>

                    <td>
                      <span className="small text-dark fw-medium">
                        <i className="bi bi-geo-alt text-danger me-1"></i>
                        {b.location}
                      </span>
                    </td>

                    <td>
                      <select
                        className={`form-select form-select-sm rounded-pill fw-semibold border-0 ${statusBadgeClass}`}
                        style={{ width: "130px", cursor: "pointer" }}
                        value={currentStatus}
                        onChange={(e) => handleStatusChange(b.booking_id || b.id, e.target.value)}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>

                    <td className="text-end pe-4">
                      <div className="d-flex justify-content-end gap-2">
                        <a
                          href={`https://wa.me/${b.phone ? b.phone.replace(/[^0-9]/g, "") : ""}`}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-sm btn-outline-success rounded-circle"
                          title="Chat on WhatsApp"
                        >
                          <i className="bi bi-whatsapp"></i>
                        </a>

                        <button
                          className="btn btn-sm btn-outline-danger rounded-circle"
                          title="Delete Request"
                          onClick={() => handleDeleteBooking(b.booking_id || b.id)}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServiceRequests;