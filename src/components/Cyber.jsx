import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Cyber = () => {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [toastMessage, setToastMessage] = useState("");

  const getServices = async () => {
    try {
      const response = await axios.get(
        "https://abedhiggs.alwaysdata.net/sseapis/getcyberservices.php"
      );
      setServices(response.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getServices();
  }, []);

  const handleDeleteService = async (serviceId, serviceName) => {
    if (window.confirm(`Are you sure you want to delete "${serviceName}"?`)) {
      try {
        const formdata = new FormData();
        formdata.append("service_id", serviceId);

        const response = await axios.post(
          "https://abedhiggs.alwaysdata.net/sseapis/deletecyberservice.php",
          formdata
        );

        if (response.data.success) {
          setToastMessage(`"${serviceName}" deleted successfully!`);
          getServices();
        } else {
          alert("Failed to delete: " + response.data.message);
        }
      } catch (err) {
        console.error(err);
        alert("An error occurred while deleting the service.");
      }

      setTimeout(() => setToastMessage(""), 3000);
    }
  };

  const handleAddToCart = (service) => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    
    const serviceItem = {
      product_id: `service_${service.service_id}`,
      product_name: service.service_name,
      product_cost: service.service_cost,
      product_image: "",
      quantity: 1,
      isService: true
    };

    const itemIndex = existingCart.findIndex(item => item.product_id === serviceItem.product_id);
    
    if (itemIndex > -1) {
      existingCart[itemIndex].quantity += 1;
    } else {
      existingCart.push(serviceItem);
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));

    setToastMessage(`"${service.service_name}" added to cart!`);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <div className="container-fluid mt-4 px-0">
      <style>{`
        .hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
        }
        .icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
      `}</style>

      <div className="container">
        {toastMessage && (
          <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
            <div className="toast show align-items-center text-white bg-success border-0 shadow-lg rounded-4 p-2">
              <div className="d-flex">
                <div className="toast-body fw-bold">
                  <i className="bi bi-cart-check-fill me-2"></i> {toastMessage}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-5">
          <h1 className="text-primary fw-bold display-5">
            S&amp;SE Cyber Services
          </h1>
          <p className="text-muted">Professional digital & cyber solutions tailored for you</p>
        </div>

        <div className="row mb-5">
          {services.length === 0 ? (
            <div className="col-12 text-center py-5">
              <div className="p-5 bg-white rounded-4 shadow-sm border border-light">
                <i className="bi bi-folder2-open display-3 text-muted mb-3"></i>
                <h4 className="text-secondary fw-semibold">No cyber services available right now.</h4>
                <p className="text-muted small">Check back later.</p>
              </div>
            </div>
          ) : (
            services.map((service) => (
              <div
                className="col-md-4 col-lg-3 mb-4"
                key={service.service_id}
              >
                <div className="card shadow-sm h-100 border-0 rounded-4 hover-lift bg-white">
                  <div className="card-body p-4 d-flex flex-column text-center">
                    <div className="mb-3">
                      <div className="bg-primary bg-opacity-10 text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px' }}>
                        <i className="bi bi-laptop fs-4"></i>
                      </div>
                    </div>
                    <h4 className="text-dark fw-bold fs-5 mb-2">
                      {service.service_name}
                    </h4>
                    <p className="text-muted small flex-grow-1">
                      {service.service_description}
                    </p>
                    <div className="my-3">
                      <span className="badge bg-success bg-opacity-10 text-success fw-bold px-3 py-2 fs-6 rounded-pill">
                        KSh {Number(service.service_cost).toLocaleString()}
                      </span>
                    </div>

                    <div className="d-flex flex-column gap-2 mt-auto">
                      <button
                        className="btn btn-outline-primary rounded-pill fw-bold w-100 py-2 shadow-sm"
                        onClick={() => handleAddToCart(service)}
                      >
                        <i className="bi bi-cart-plus-fill me-2"></i> Add to Cart
                      </button>
                      <button
                        className="btn btn-success rounded-pill fw-bold w-100 py-2 shadow-sm"
                        onClick={() => navigate("/makepayment", { state: { service } })}
                      >
                        <i className="bi bi-shield-lock-fill me-2"></i> Pay for Service
                      </button>

                      <div className="d-flex gap-2 mt-1">
                        <button
                          className="btn btn-warning btn-sm rounded-pill fw-bold flex-grow-1 text-white"
                          onClick={() => 
                            navigate("/editcyber", { 
                              state: { 
                                cyber: {
                                  service_id: service.service_id,
                                  service_name: service.service_name,
                                  service_description: service.service_description,
                                  service_cost: service.service_cost
                                } 
                              } 
                            })
                          }
                        >
                          <i className="bi bi-pencil-square me-1"></i> Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm rounded-pill fw-bold flex-grow-1"
                          onClick={() => handleDeleteService(service.service_id, service.service_name)}
                        >
                          <i className="bi bi-trash-fill me-1"></i> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      {/* ================= CONTACT US ================= */}
        <section id="contact" className="py-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header text-center text-white py-4 bg-dark">
              <h2 className="mb-1 fw-bold">Get In Touch</h2>
              <p className="text-white-50 mb-0 small">Have questions? Reach out to us anytime.</p>
            </div>
            <div className="card-body p-4 p-md-5 bg-white">
              <div className="row g-4 text-center">
                {/* Physical Location */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-success text-white mx-auto mb-3">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Physical Location</h5>
                    <p className="text-muted small mb-0">
                      Stanley &amp; Edricks Consultants Stall,Ekero,Along main road to Mission Hospital Road,Mumias.
                    </p>
                  </div>
                </div>

                {/* Postal Address */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-secondary text-white mx-auto mb-3">
                      <i className="bi bi-mailbox"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Postal Address</h5>
                    <p className="text-muted small mb-0">
                      P.O. Box , Mumias, Kenya
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-primary text-white mx-auto mb-3">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Phone Number</h5>
                    <p className="text-muted small mb-0">0721 772 737</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-warning text-white mx-auto mb-3">
                      <i className="bi bi-clock-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Business Hours</h5>
                    <p className="text-muted small mb-0">
                      Mon - Sun: 9:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-5 pt-3 border-top">
                <h5 className="text-success fw-bold">Stanley &amp; Edricks Consultants</h5>
                <p className="text-muted mb-0 small">
                  Email us at <span className="fw-semibold text-dark">sse@gmail.com</span> for prompt assistance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Cyber;