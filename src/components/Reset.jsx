import React, { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Reset = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");

    if (!token) {
      setError("Invalid or expired reset token. Please request a new link.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please check and try again.");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("token", token);
    formData.append("password", password);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/resetpassword.php",
        formData
      );
      setLoading(false);

      if (response.data.success) {
        setSuccess(response.data.message || "Password reset successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setError(response.data.message || "Unable to reset password.");
      }
    } catch (err) {
      setLoading(false);
      setError("Server error. Please try again later.");
    }
  };

  return (
    <div className="container-fluid min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      <style>{`
        .icon-box {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6 col-xl-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="card-body p-4 p-sm-5 bg-white text-center">
                
                {/* Icon Header */}
                <div className="icon-box bg-primary bg-opacity-10 text-primary mx-auto mb-4">
                  <i className="bi bi-shield-lock-fill"></i>
                </div>

                <h2 className="fw-bold text-dark mb-2">Create New Password</h2>
                <p className="text-muted small mb-4">
                  Your new password must be different from previous used passwords.
                </p>

                {/* Missing Token Warning */}
                {!token && (
                  <div className="alert alert-warning d-flex align-items-center text-start shadow-sm border-0 rounded-3 p-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-circle-fill flex-shrink-0 me-3 fs-4 text-warning"></i>
                    <div className="small">
                      <strong>Missing Token:</strong> No reset token found in the URL. Please use the exact link sent to your email.
                    </div>
                  </div>
                )}

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center text-start shadow-sm border-0 rounded-3 p-3 mb-4" role="alert">
                    <i className="bi bi-check-circle-fill flex-shrink-0 me-3 fs-4 text-success"></i>
                    <div className="small">
                      {success}
                      <br />
                      <span className="text-muted mt-1 d-inline-block">Redirecting to login...</span>
                    </div>
                  </div>
                )}

                {/* Error Alert */}
                {error && (
                  <div className="alert alert-danger d-flex align-items-center text-start shadow-sm border-0 rounded-3 p-3 mb-4" role="alert">
                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-3 fs-4 text-danger"></i>
                    <div className="small">{error}</div>
                  </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="text-start">
                  
                  {/* New Password Input */}
                  <div className="mb-3">
                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                      New Password
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-lock"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 bg-light fs-6"
                        placeholder="Enter new password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                        disabled={loading || !token || Boolean(success)}
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

                  {/* Confirm Password Input */}
                  <div className="mb-4">
                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                      Confirm Password
                    </label>
                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                      <span className="input-group-text bg-light border-0 text-muted ps-3">
                        <i className="bi bi-lock-fill"></i>
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control border-0 bg-light fs-6"
                        placeholder="Repeat new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        minLength="6"
                        disabled={loading || !token || Boolean(success)}
                      />
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mb-4">
                    <button
                      className="btn btn-primary btn-lg shadow-sm fw-bold rounded-pill py-3 d-flex justify-content-center align-items-center"
                      type="submit"
                      disabled={loading || !token || Boolean(success)}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Updating Password...
                        </>
                      ) : (
                        <>
                          Reset Password
                          <i className="bi bi-check2-circle ms-2"></i>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* Navigation Links */}
                <div className="pt-3 border-top">
                  <Link
                    to="/signin"
                    className="text-decoration-none fw-semibold small text-primary d-inline-flex align-items-center"
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Back to Sign In
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

export default Reset;