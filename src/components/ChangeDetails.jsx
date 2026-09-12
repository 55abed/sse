import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ChangeDetails = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  // Load existing user details on render
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    if (storedUser?.username) setUsername(storedUser.username);
    if (storedUser?.email) setEmail(storedUser.email);
    if (storedUser?.phone) setPhone(storedUser.phone);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
    const userId = storedUser?.id || 1; // Fallback ID for testing

    if (!currentPassword) {
      setStatus({ type: "danger", message: "Please enter your current password to save changes." });
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/changedetails.php",
        {
          user_id: userId,
          current_password: currentPassword,
          username: username,
          email: email,
          phone: phone,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        setStatus({ type: "success", message: response.data.message });
        setCurrentPassword("");

        // Sync local storage session
        const updatedUser = {
          ...storedUser,
          username: username,
          email: email,
          phone: phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));
      } else {
        setStatus({ type: "danger", message: response.data.message });
      }
    } catch (err) {
      const serverMsg = err.response?.data?.message || "Server error. Please try again later.";
      setStatus({ type: "danger", message: serverMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-sm-5 bg-white text-center">

                {/* Header Icon */}
                <div 
                  className="bg-primary bg-opacity-10 text-primary mx-auto mb-4 rounded-4 d-flex align-items-center justify-content-center"
                  style={{ width: "64px", height: "64px", fontSize: "28px" }}
                >
                  <i className="bi bi-person-gear"></i>
                </div>

                <h3 className="fw-bold text-dark mb-2">Update Profile Details</h3>
                <p className="text-muted small mb-4">
                  Modify your profile details and confirm with your current password.
                </p>

                {/* Status Alert */}
                {status.message && (
                  <div className={`alert alert-${status.type} d-flex align-items-center text-start border-0 rounded-3 p-3 mb-4 shadow-sm`} role="alert">
                    <i className={`bi ${status.type === 'success' ? 'bi-check-circle-fill text-success' : 'bi-exclamation-triangle-fill text-danger'} flex-shrink-0 me-3 fs-5`}></i>
                    <div className="small fw-semibold">{status.message}</div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="text-start">
                  
                  {/* Username Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">
                      Username
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-person"></i>
                      </span>
                      <input
                        type="text"
                        className="form-control border-0 bg-light fs-6"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Email Address Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">
                      Email Address
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-envelope-at"></i>
                      </span>
                      <input
                        type="email"
                        className="form-control border-0 bg-light fs-6"
                        placeholder="name@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Phone Number Field */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase">
                      Phone Number
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-telephone"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control border-0 bg-light fs-6"
                        placeholder="0XXXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        disabled={loading}
                      />
                    </div>
                  </div>

                  {/* Current Password Field (Authorization) */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small text-uppercase">
                      Current Password (To Confirm)
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-key"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 bg-light fs-6"
                        placeholder="Enter current password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        disabled={loading}
                      />
                      <button
                        className="btn bg-light border-0 text-muted pe-3"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                      >
                        <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button
                      className="btn btn-primary btn-lg shadow-sm fw-bold rounded-pill py-3 d-flex justify-content-center align-items-center"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          Update Details
                          <i className="bi bi-arrow-right-short ms-1 fs-4"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Return Navigation */}
                <div className="pt-3 border-top">
                  <Link to="/dashboard" className="text-decoration-none fw-semibold small text-secondary">
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Dashboard
                  </Link>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeDetails;