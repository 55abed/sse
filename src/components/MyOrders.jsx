import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Retrieve completed orders stored locally from standard checkout
    const savedOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
    setOrders(savedOrders);
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            
            {/* Header with Top Action Buttons */}
            <div className="d-flex flex-wrap align-items-center justify-content-between mb-4 gap-3">
              <div>
                <h2 className="fw-bold text-dark mb-1">
                  <i className="bi bi-bag-check-fill text-success me-2"></i>
                  My Previous Purchases
                </h2>
                <p className="text-muted small mb-0">
                  Track and view the history of your completed product orders.
                </p>
              </div>
              <div className="d-flex flex-wrap gap-2">
                <button
                  className="btn btn-outline-success rounded-pill px-3"
                  onClick={() => navigate("/home#shop")}
                >
                  <i className="bi bi-shop me-1"></i> Go to Shop Section
                </button>
                <button
                  className="btn btn-success rounded-pill px-3"
                  onClick={() => {
                    navigate("/home");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  <i className="bi bi-house-door-fill me-1"></i> Back to Home Top
                </button>
              </div>
            </div>

            {/* Orders List / Empty State */}
            {orders.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <div className="py-4">
                  <i className="bi bi-receipt fs-1 text-muted d-block mb-3"></i>
                  <h4 className="fw-bold text-dark mb-2">No purchases found</h4>
                  <p className="text-muted small mb-0">
                    You haven't completed any product purchases yet. Check out items from the shop to see them here.
                  </p>
                </div>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {orders.map((order) => (
                  <div key={order.id} className="card border-0 shadow-sm rounded-4 p-4 bg-white">
                    <div className="d-flex flex-wrap justify-content-between align-items-center border-bottom pb-3 mb-3">
                      <div>
                        <span className="badge bg-success-subtle text-success fw-bold px-3 py-2 rounded-pill me-2">
                          {order.status || "Completed"}
                        </span>
                        <small className="text-muted">
                          Order Date: {new Date(order.date).toLocaleString()}
                        </small>
                      </div>
                      <div className="text-end mt-2 mt-sm-0">
                        <span className="text-muted small me-2">Total Paid:</span>
                        <span className="fw-bold text-success fs-5">
                          KSH {order.totalAmount}
                        </span>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div className="list-group list-group-flush">
                      {order.items && order.items.map((item, idx) => {
                        const rawImg = item.product_image || item.image || item.imageUrl || "";
                        const imageUrl = rawImg.startsWith("http") || rawImg.startsWith("/") 
                          ? rawImg 
                          : `https://abedhiggs.alwaysdata.net/sseapis/uploads/${rawImg}`;

                        return (
                          <div key={idx} className="list-group-item px-0 py-2 d-flex align-items-center justify-content-between border-0">
                            <div className="d-flex align-items-center">
                              {rawImg ? (
                                <img
                                  src={imageUrl}
                                  alt={item.product_name}
                                  className="rounded-3 border me-3 object-fit-cover"
                                  style={{ width: "50px", height: "50px" }}
                                  onError={(e) => { e.target.style.display = "none"; }}
                                />
                              ) : (
                                <div className="rounded-3 border bg-light d-flex align-items-center justify-content-center me-3 text-muted" style={{ width: "50px", height: "50px" }}>
                                  <i className="bi bi-image"></i>
                                </div>
                              )}
                              <div>
                                <h6 className="fw-bold text-dark mb-0">{item.product_name}</h6>
                                <small className="text-muted">
                                  Qty: {item.quantity || 1} &times; KSH {item.product_cost}
                                </small>
                              </div>
                            </div>
                            <span className="fw-bold text-dark small">
                              KSH {Number(item.product_cost) * (item.quantity || 1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;