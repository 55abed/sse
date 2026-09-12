import React, { useEffect, useState } from "react";
import axios from "axios";

const ComputerServices = ({ user: propUser }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(propUser || null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Admin Service Form state
  const [showForm, setShowForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    service_name: "",
    category: "Computer Repair",
    price: "",
    description: "",
    image_url: "",
  });

  // Customer Booking Modal state
  const [selectedService, setSelectedService] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingForm, setBookingForm] = useState({
    phone: "",
    location: "",
    service_date: "",
    notes: "",
  });
  const [submittingBooking, setSubmittingBooking] = useState(false);

  useEffect(() => {
    if (propUser) {
      setUser(propUser);
    } else {
      const savedUser = localStorage.getItem("user");
      if (savedUser) setUser(JSON.parse(savedUser));
    }
    fetchServices();
  }, [propUser]);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getservices.php");
      if (Array.isArray(res.data)) {
        setServices(res.data);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filtered services for real-time search & dropdown suggestions
  const filteredServices = services.filter((srv) =>
    srv.service_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    srv.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    srv.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ================= ADMIN HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreateForm = () => {
    setEditingService(null);
    setFormData({
      service_name: "",
      category: "Computer Repair",
      price: "",
      description: "",
      image_url: "",
    });
    setShowForm(true);
  };

  const handleStartEdit = (service) => {
    setEditingService(service);
    setFormData({
      service_name: service.service_name || "",
      category: service.category || "Computer Repair",
      price: service.price || "",
      description: service.description || "",
      image_url: service.image_url || "",
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.service_name || !formData.price || !formData.description) {
      alert("Please complete required fields.");
      return;
    }

    try {
      if (editingService) {
        await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updateservice.php", {
          service_id: editingService.service_id,
          ...formData,
        });
        alert("Service updated successfully!");
      } else {
        await axios.post("https://abedhiggs.alwaysdata.net/sseapis/addservice.php", formData);
        alert("New service added successfully!");
      }

      setShowForm(false);
      setEditingService(null);
      fetchServices();
    } catch (err) {
      console.error("Error saving service:", err);
      alert("Failed to save service.");
    }
  };

  const handleDelete = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;

    try {
      await axios.post("https://abedhiggs.alwaysdata.net/sseapis/deleteservice.php", {
        service_id: serviceId,
      });
      alert("Service deleted successfully.");
      fetchServices();
    } catch (err) {
      console.error("Error deleting service:", err);
      alert("Failed to delete service.");
    }
  };

  /* ================= BOOKING HANDLERS ================= */
  const handleOpenBooking = (service) => {
    setSelectedService(service);
    setBookingForm({
      phone: user?.phone || "",
      location: "",
      service_date: "",
      notes: "",
    });
    setShowBookingModal(true);
  };

  const handleBookingInputChange = (e) => {
    const { name, value } = e.target;
    setBookingForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!bookingForm.phone || !bookingForm.location || !bookingForm.service_date) {
      alert("Please fill in your phone number, location, and preferred date.");
      return;
    }

    const payload = {
      service_id: selectedService.service_id,
      service_name: selectedService.service_name,
      price: selectedService.price,
      user_id: user?.user_id || user?.id || null,
      username: user?.username || "Guest",
      phone: bookingForm.phone,
      location: bookingForm.location,
      service_date: bookingForm.service_date,
      notes: bookingForm.notes,
    };

    try {
      setSubmittingBooking(true);
      const response = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/bookservice.php", payload);
      
      if (response.data && response.data.status === "error") {
        alert("Booking failed: " + response.data.message);
      } else {
        alert(`Booking request submitted successfully for "${selectedService.service_name}"! We will contact you at ${bookingForm.phone}.`);
        setShowBookingModal(false);
        setSelectedService(null);
      }
    } catch (err) {
      console.error("Booking error:", err);
      alert("Failed to submit booking. Please try again or contact support.");
    } finally {
      setSubmittingBooking(false);
    }
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <span className="badge bg-primary bg-opacity-10 text-primary fw-bold px-3 py-2 rounded-pill mb-2">
          <i className="bi bi-tools me-1"></i> Technical Solutions
        </span>
        <h1 className="fw-bold text-dark display-5">Computer &amp; Tech Services</h1>
        <p className="text-muted">
          Professional repair, networking, and IT support services tailored to your needs.
        </p>

        {/* Real-time Search Box with Dropdown Suggestions */}
        <div className="row justify-content-center mt-4">
          <div className="col-md-6 position-relative">
            <div className="input-group shadow-sm rounded-pill overflow-hidden border">
              <span className="input-group-text bg-white border-0 ps-3 text-muted">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-0 shadow-none py-2"
                placeholder="Search services by name, category, or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setIsSearching(true);
                }}
                onFocus={() => setIsSearching(true)}
              />
              {searchTerm && (
                <button
                  className="btn btn-white border-0 text-muted"
                  type="button"
                  onClick={() => setSearchTerm("")}
                >
                  <i className="bi bi-x-lg"></i>
                </button>
              )}
            </div>

            {/* Real-time Dropdown Suggestions */}
            {isSearching && searchTerm.trim() !== "" && (
              <div 
                className="position-absolute w-100 bg-white shadow-lg rounded-4 mt-2 border start-0 overflow-hidden text-start"
                style={{ zIndex: 1000, maxHeight: "300px", overflowY: "auto" }}
              >
                {filteredServices.length > 0 ? (
                  filteredServices.map((srv) => (
                    <div
                      key={srv.service_id}
                      className="p-3 border-bottom d-flex justify-content-between align-items-center hover-bg cursor-pointer"
                      style={{ cursor: "pointer", transition: "background 0.2s" }}
                      onClick={() => {
                        setSearchTerm(srv.service_name);
                        setIsSearching(false);
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f8f9fa"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      <div>
                        <h6 className="mb-0 fw-bold text-dark">{srv.service_name}</h6>
                        <small className="text-muted text-truncate d-block" style={{ maxWidth: "250px" }}>
                          {srv.description}
                        </small>
                      </div>
                      <span className="badge bg-success bg-opacity-10 text-success fw-bold">
                        KSh {parseFloat(srv.price).toLocaleString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="p-3 text-center text-muted small">
                    No matching services found.
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Admin Controls */}
        {user && user.role === "admin" && (
          <div className="mt-4">
            <button
              className="btn btn-primary rounded-pill px-4 fw-bold shadow-sm"
              onClick={() => (showForm ? setShowForm(false) : handleOpenCreateForm())}
            >
              <i className={`bi ${showForm ? "bi-x-lg" : "bi-plus-lg"} me-2`}></i>
              {showForm ? "Close Form" : "Add New Service"}
            </button>
          </div>
        )}
      </div>

      {/* Admin Form */}
      {user && user.role === "admin" && showForm && (
        <div className="card border-0 shadow-lg p-4 p-md-5 rounded-4 mb-5 bg-dark text-white max-w-2xl mx-auto">
          <h4 className="fw-bold text-info mb-4">
            <i className="bi bi-gear-fill me-2"></i>
            {editingService ? "Edit Service Details" : "Add New Computer Service"}
          </h4>
          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-7">
                <label className="form-label small fw-semibold">Service Name *</label>
                <input
                  type="text"
                  name="service_name"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="e.g., Computer Repair & Maintenance"
                  value={formData.service_name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-5">
                <label className="form-label small fw-semibold">Category *</label>
                <select
                  name="category"
                  className="form-select bg-secondary text-white border-0"
                  value={formData.category}
                  onChange={handleInputChange}
                >
                  <option value="Networking">Networking</option>
                  <option value="Computer Repair">Computer Repair</option>
                  <option value="Software Installation">Software Installation</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Price (KSh) *</label>
                <input
                  type="number"
                  step="1"
                  name="price"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="e.g., 2500"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label small fw-semibold">Image URL (Optional)</label>
                <input
                  type="url"
                  name="image_url"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image_url}
                  onChange={handleInputChange}
                />
              </div>

              <div className="col-12">
                <label className="form-label small fw-semibold">Description *</label>
                <textarea
                  name="description"
                  rows="4"
                  className="form-control bg-secondary text-white border-0"
                  placeholder="Describe what is included in this service..."
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="col-12 d-flex justify-content-end gap-2 mt-4">
                <button
                  type="button"
                  className="btn btn-outline-light rounded-pill px-4"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-info rounded-pill px-5 fw-bold">
                  {editingService ? "Update Service" : "Save Service"}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-2">Loading services...</p>
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-5 bg-light rounded-4">
          <i className="bi bi-tools display-4 text-muted mb-3 d-block"></i>
          <h5>No computer services found.</h5>
        </div>
      ) : (
        <div className="row g-4">
          {filteredServices.map((srv) => (
            <div className="col-md-6 col-lg-4" key={srv.service_id}>
              <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden position-relative">
                <img
                  src={
                    srv.image_url ||
                    "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80"
                  }
                  alt={srv.service_name}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                />

                {/* Admin Actions Overlay */}
                {user && user.role === "admin" && (
                  <div className="position-absolute top-0 end-0 m-3 d-flex gap-2">
                    <button
                      className="btn btn-light btn-sm rounded-circle shadow-sm"
                      title="Edit Service"
                      onClick={() => handleStartEdit(srv)}
                    >
                      <i className="bi bi-pencil-fill text-primary"></i>
                    </button>
                    <button
                      className="btn btn-light btn-sm rounded-circle shadow-sm"
                      title="Delete Service"
                      onClick={() => handleDelete(srv.service_id)}
                    >
                      <i className="bi bi-trash-fill text-danger"></i>
                    </button>
                  </div>
                )}

                <div className="card-body p-4 d-flex flex-column">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="badge bg-primary bg-opacity-10 text-primary rounded-pill">
                      {srv.category}
                    </span>
                    <span className="fw-bold text-success fs-5">
                      KSh {parseFloat(srv.price).toLocaleString()}
                    </span>
                  </div>

                  <h5 className="fw-bold text-dark mb-2">{srv.service_name}</h5>
                  <p className="text-muted small flex-grow-1">{srv.description}</p>

                  <button
                    className="btn btn-outline-primary rounded-pill w-100 fw-semibold mt-3"
                    onClick={() => handleOpenBooking(srv)}
                  >
                    <i className="bi bi-calendar-check me-2"></i> Book Service
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= BOOKING MODAL ================= */}
      {showBookingModal && selectedService && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)" }}
          tabIndex="-1"
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="modal-header bg-primary text-white border-0 px-4 py-3">
                <h5 className="modal-header-title mb-0 fw-bold d-flex align-items-center gap-2">
                  <i className="bi bi-laptop fs-5"></i> Book {selectedService.service_name}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowBookingModal(false)}
                ></button>
              </div>

              <form onSubmit={handleBookingSubmit}>
                <div className="modal-body p-4">
                  <div className="alert alert-light border border-info border-opacity-25 rounded-3 d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <small className="text-muted d-block">Estimated Service Cost</small>
                      <strong className="text-success fs-5">
                        KSh {parseFloat(selectedService.price).toLocaleString()}
                      </strong>
                    </div>
                    <span className="badge bg-info bg-opacity-10 text-info px-3 py-2 rounded-pill">
                      {selectedService.category}
                    </span>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Phone Number (M-Pesa / Contact) *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="bi bi-telephone-fill"></i>
                      </span>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control border-start-0 ps-0"
                        placeholder="e.g., 0712345678"
                        value={bookingForm.phone}
                        onChange={handleBookingInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Your Location / Address *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="bi bi-geo-alt-fill"></i>
                      </span>
                      <input
                        type="text"
                        name="location"
                        className="form-control border-start-0 ps-0"
                        placeholder="e.g., Westlands, Nairobi / Building Name"
                        value={bookingForm.location}
                        onChange={handleBookingInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Preferred Date &amp; Time *
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light text-muted border-end-0">
                        <i className="bi bi-clock-fill"></i>
                      </span>
                      <input
                        type="datetime-local"
                        name="service_date"
                        className="form-control border-start-0 ps-0"
                        value={bookingForm.service_date}
                        onChange={handleBookingInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small fw-bold text-secondary">
                      Specific Details / Computer Issue (Optional)
                    </label>
                    <textarea
                      name="notes"
                      rows="3"
                      className="form-control"
                      placeholder="Briefly describe the computer issue or setup needed..."
                      value={bookingForm.notes}
                      onChange={handleBookingInputChange}
                    ></textarea>
                  </div>
                </div>

                <div className="modal-footer bg-light border-0 px-4 py-3 d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary rounded-pill px-4"
                    onClick={() => setShowBookingModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill px-4 fw-bold"
                    disabled={submittingBooking}
                  >
                    {submittingBooking ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle-fill me-1"></i> Confirm Booking
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComputerServices;