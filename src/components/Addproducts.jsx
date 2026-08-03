import axios from "axios";
import React, { useState } from "react";

const Addproducts = () => {
  // ================= PRODUCTS =================
  const [product_name, setProductnName] = useState("");
  const [product_description, setProductDescription] = useState("");
  const [product_cost, setProductCost] = useState("");
  const [product_photo, setProductPhoto] = useState(null);
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading("Please wait...");
    setSuccess("");
    setError("");

    const formdata = new FormData();
    formdata.append("product_name", product_name);
    formdata.append("product_description", product_description);
    formdata.append("product_cost", product_cost);
    formdata.append("product_photo", product_photo);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/addproducts.php",
        formdata
      );
      setSuccess(response.data.message);
      setLoading("");
    } catch (error) {
      setError(error.message);
      setLoading("");
    }
  };

  // ================= CYBER SERVICES =================
  const [service_name, setServiceName] = useState("");
  const [service_description, setServiceDescription] = useState("");
  const [service_cost, setServiceCost] = useState("");
  const [serviceLoading, setServiceLoading] = useState("");
  const [serviceSuccess, setServiceSuccess] = useState("");
  const [serviceError, setServiceError] = useState("");

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceLoading("Please wait...");
    setServiceSuccess("");
    setServiceError("");

    const formdata = new FormData();
    formdata.append("service_name", service_name);
    formdata.append("service_description", service_description);
    formdata.append("service_cost", service_cost);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/addcyberservice.php",
        formdata
      );
      setServiceSuccess(response.data.message);
      setServiceLoading("");
      setServiceName("");
      setServiceDescription("");
      setServiceCost("");
    } catch (error) {
      setServiceError(error.message);
      setServiceLoading("");
    }
  };

  return (
    <div className="container py-5">
      {/* Custom Styles */}
      <style>{`
        .admin-card {
          border: none;
          border-radius: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .admin-card:hover {
          box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
        }
        .card-header-product {
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
        }
        .card-header-service {
          background: linear-gradient(135deg, #198754, #146c43);
        }
        .icon-badge {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          font-size: 1.35rem;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd;
        }
        .input-group-text {
          background-color: #f8f9fa;
        }
        .btn-gradient-primary {
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          border: none;
        }
        .btn-gradient-primary:hover {
          background: linear-gradient(135deg, #0b5ed7, #0a58ca);
        }
        .btn-gradient-success {
          background: linear-gradient(135deg, #198754, #146c43);
          border: none;
        }
        .btn-gradient-success:hover {
          background: linear-gradient(135deg, #146c43, #115c39);
        }
      `}</style>

      {/* Dashboard Page Header */}
      <div className="text-center mb-5">
        <h2 className="fw-bold text-dark mb-1">Admin Content Management</h2>
        <p className="text-muted small">Add new products to inventory or publish new cyber services</p>
      </div>

      <div className="row g-4 justify-content-center">
        {/* ================= PRODUCT FORM ================= */}
        <div className="col-12 col-lg-6">
          <div className="card admin-card h-100">
            
            {/* Form Header */}
            <div className="card-header card-header-product text-white p-4 border-0">
              <div className="d-flex align-items-center">
                <div className="icon-badge bg-white text-primary me-3 shadow-sm">
                  <i className="bi bi-box-seam-fill"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">Add Product</h4>
                  <small className="text-white-50">Upload inventory items with images</small>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-sm-4 d-flex flex-column">
              {/* Alert Status Banners */}
              {loading && (
                <div className="alert alert-info d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <div className="small fw-semibold">{loading}</div>
                </div>
              )}

              {success && (
                <div className="alert alert-success d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div className="small fw-semibold">{success}</div>
                </div>
              )}

              {error && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div className="small fw-semibold">{error}</div>
                </div>
              )}

              <form onSubmit={handlesubmit} className="d-flex flex-column flex-grow-1">
                {/* Product Name Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Product Name</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-tag"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g., BlueBand, Rice"
                      onChange={(e) => setProductnName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Product Description Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Description</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-file-earmark-text"></i>
                    </span>
                    <textarea
                      className="form-control border-start-0 ps-0"
                      rows="3"
                      placeholder="Enter detailed product specifications"
                      onChange={(e) => setProductDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Product Cost Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Price (KSh)</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-currency-dollar"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control border-start-0 ps-0"
                      placeholder="0.00"
                      onChange={(e) => setProductCost(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Product Photo Input */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Product Image</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-image"></i>
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="form-control border-start-0 ps-0"
                      onChange={(e) => setProductPhoto(e.target.files[0])}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-auto">
                  <button
                    type="submit"
                    className="btn btn-gradient-primary w-100 py-2.5 rounded-3 fw-bold text-white shadow-sm"
                    disabled={!!loading}
                  >
                    {loading ? "Adding Product..." : "Add Product"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>

        {/* ================= CYBER SERVICES FORM ================= */}
        <div className="col-12 col-lg-6">
          <div className="card admin-card h-100">
            
            {/* Form Header */}
            <div className="card-header card-header-service text-white p-4 border-0">
              <div className="d-flex align-items-center">
                <div className="icon-badge bg-white text-success me-3 shadow-sm">
                  <i className="bi bi-pc-display-horizontal"></i>
                </div>
                <div>
                  <h4 className="fw-bold mb-0">Add Cyber Service</h4>
                  <small className="text-white-50">Publish online or office services</small>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-sm-4 d-flex flex-column">
              {/* Alert Status Banners */}
              {serviceLoading && (
                <div className="alert alert-info d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  <div className="small fw-semibold">{serviceLoading}</div>
                </div>
              )}

              {serviceSuccess && (
                <div className="alert alert-success d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  <div className="small fw-semibold">{serviceSuccess}</div>
                </div>
              )}

              {serviceError && (
                <div className="alert alert-danger d-flex align-items-center rounded-3 py-2 px-3 mb-3" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <div className="small fw-semibold">{serviceError}</div>
                </div>
              )}

              <form onSubmit={handleServiceSubmit} className="d-flex flex-column flex-grow-1">
                {/* Service Name Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Service Name</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-gear"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="e.g., KRA Pin Registration, Printing"
                      value={service_name}
                      onChange={(e) => setServiceName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Service Description Input */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Description</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-card-text"></i>
                    </span>
                    <textarea
                      className="form-control border-start-0 ps-0"
                      rows="3"
                      placeholder="Enter service details and requirements"
                      value={service_description}
                      onChange={(e) => setServiceDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                </div>

                {/* Service Cost Input */}
                <div className="mb-4">
                  <label className="form-label text-secondary small fw-bold">Service Fee (KSh)</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-cash-stack"></i>
                    </span>
                    <input
                      type="number"
                      className="form-control border-start-0 ps-0"
                      placeholder="0.00"
                      value={service_cost}
                      onChange={(e) => setServiceCost(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="mt-auto">
                  <button
                    type="submit"
                    className="btn btn-gradient-success w-100 py-2.5 rounded-3 fw-bold text-white shadow-sm"
                    disabled={!!serviceLoading}
                  >
                    {serviceLoading ? "Adding Service..." : "Add Cyber Service"}
                  </button>
                </div>
              </form>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default Addproducts;