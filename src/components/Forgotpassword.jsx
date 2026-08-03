import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess("");
    setError("");

    const formData = new FormData();
    formData.append("email", email);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/forgotpassword.php",
        formData
      );
      setLoading(false);

      if (response.data.success) {
        setSuccess(
          "We have sent a password reset link to your email address. Please check your inbox and spam folder."
        );
        setEmail("");
      } else {
        setError(response.data.message || "Unable to process your request.");
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
                  <i className="bi bi-key-fill"></i>
                </div>

                <h2 className="fw-bold text-dark mb-2">Forgot Password?</h2>
                <p className="text-muted small mb-4">
                  Enter the email address associated with your account and we'll send you a link to reset your password.
                </p>

                {/* Success Alert */}
                {success && (
                  <div className="alert alert-success d-flex align-items-center text-start shadow-sm border-0 rounded-3 p-3 mb-4" role="alert">
                    <i className="bi bi-check-circle-fill flex-shrink-0 me-3 fs-4 text-success"></i>
                    <div className="small">{success}</div>
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
                {!success ? (
                  <form onSubmit={handleSubmit} className="text-start">
                    <div className="mb-4">
                      <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                        Email Address
                      </label>
                      <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                        <span className="input-group-text bg-light border-0 text-muted ps-3">
                          <i className="bi bi-envelope"></i>
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

                    <div className="d-grid mb-4">
                      <button
                        className="btn btn-primary btn-lg shadow-sm fw-bold rounded-pill py-3 d-flex justify-content-center align-items-center"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending Link...
                          </>
                        ) : (
                          <>
                            Send Reset Link
                            <i className="bi bi-arrow-right ms-2"></i>
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="d-grid mb-4">
                    <button
                      type="button"
                      className="btn btn-outline-primary btn-lg rounded-pill py-3 fw-semibold"
                      onClick={() => setSuccess("")}
                    >
                      Try Another Email
                    </button>
                  </div>
                )}

                {/* Back to Login Link */}
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

export default ForgotPassword;