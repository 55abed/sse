import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPreorders = () => {
  const [preorders, setPreorders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/get_preorders.php");
      if (response.data.success) {
        setPreorders(response.data.preorders || []);
      } else {
        setError("Failed to load pre-orders.");
      }
    } catch (err) {
      setError("Network error. Could not connect to backend server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPreorders();
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        {/* Page Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
              ADMIN PANEL
            </span>
            <h2 className="fw-bold text-dark mb-0">Customer Pre-Orders</h2>
            <p className="text-muted small">
              Manage and track all physical collection and item pre-orders paid via M-Pesa.
            </p>
          </div>
          <button
            className="btn btn-outline-success rounded-pill px-4 fw-bold shadow-sm"
            onClick={fetchPreorders}
          >
            <i className="bi bi-arrow-clockwise me-2"></i> Refresh List
          </button>
        </div>

        {/* Error / Loading States */}
        {error && <div className="alert alert-danger rounded-3">{error}</div>}

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status"></div>
            <p className="text-muted mt-2">Loading pre-orders...</p>
          </div>
        ) : preorders.length === 0 ? (
          <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
            <i className="bi bi-inbox fs-1 text-muted mb-2"></i>
            <h5 className="fw-bold text-dark">No Pre-Orders Yet</h5>
            <p className="text-muted small mb-0">
              When customers complete M-Pesa payments for pre-orders, they will show up here instantly.
            </p>
          </div>
        ) : (
          /* Preorders Table */
          <div className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light text-uppercase fs-7">
                  <tr>
                    <th className="py-3 px-4"># ID</th>
                    <th className="py-3">Customer Info</th>
                    <th className="py-3">Items Ordered</th>
                    <th className="py-3">Total Amount</th>
                    <th className="py-3">Status</th>
                    <th className="py-3 text-end px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {preorders.map((order) => (
                    <tr key={order.id || order.preorder_id}>
                      <td className="fw-bold text-muted px-4">
                        #{order.id || order.preorder_id}
                      </td>
                      <td>
                        <div className="fw-bold text-dark">{order.customer_name}</div>
                        <small className="text-muted">
                          <i className="bi bi-telephone me-1"></i>
                          {order.phone}
                        </small>
                        {order.notes && (
                          <div className="text-muted small fst-italic">
                            Note: {order.notes}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="d-flex flex-column gap-2 py-2">
                          {(() => {
                            let parsedItems = [];
                            try {
                              parsedItems = typeof order.items === "string" 
                                ? JSON.parse(order.items) 
                                : order.items || [];
                            } catch (e) {
                              parsedItems = [];
                            }

                            return parsedItems.length > 0 ? (
                              parsedItems.map((itm, i) => {
                                const rawImg = itm.product_photo || itm.product_image || itm.image || "";
                                const imageUrl = rawImg.startsWith("http") || rawImg.startsWith("/") 
                                  ? rawImg 
                                  : `https://abedhiggs.alwaysdata.net/sseapis/productphotos/${rawImg}`;

                                return (
                                  <div key={i} className="d-flex align-items-center gap-2">
                                    {rawImg ? (
                                      <img
                                        src={imageUrl}
                                        alt=""
                                        className="rounded border object-fit-cover"
                                        style={{ width: "35px", height: "35px" }}
                                        onError={(e) => { e.target.style.display = "none"; }}
                                      />
                                    ) : (
                                      <div className="rounded border bg-light d-flex align-items-center justify-content-center text-muted" style={{ width: "35px", height: "35px" }}>
                                        <i className="bi bi-image fs-6"></i>
                                      </div>
                                    )}
                                    <span className="small text-dark fw-semibold">
                                      {itm.product_name} <span className="text-muted">(&times;{itm.quantity || 1})</span>
                                    </span>
                                  </div>
                                );
                              })
                            ) : (
                              <span className="text-muted small">No items listed</span>
                            );
                          })()}
                        </div>
                      </td>
                      <td className="fw-bold text-success">
                        KSH {order.total_amount || order.amount}
                      </td>
                      <td>
                        <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-1 rounded-pill">
                          {order.status || "Paid / Processing"}
                        </span>
                      </td>
                      <td className="text-muted small text-end px-4">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : "Recent"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPreorders;