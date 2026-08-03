import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading("Please wait...");
    setSuccess("");
    setError("");

    const formdata = new FormData();
    formdata.append("email", email);
    formdata.append("password", password);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/signin.php",
        formdata
      );
      setLoading("");
      if (response.data.success) {
        setSuccess(response.data.message);
        localStorage.setItem(
          "user",
          JSON.stringify(response.data.user)
        );
        navigate("/home");
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      console.log(err);
      console.log(err.response);
      setLoading("");
      if (err.response) {
        setError(err.response.data.message || "Server Error");
      } else {
        setError(err.message);
      }
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5">
      {/* Custom Styling for Visual Enhancements */}
      <style>{`
        .signin-card {
          border: none;
          border-radius: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          background: #ffffff;
          overflow: hidden;
        }
        .signin-header-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(13, 110, 253, 0.1);
          color: #0d6efd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.75rem;
          margin: 0 auto 1rem;
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd;
        }
        .input-group-text {
          background-color: #f8f9fa;
        }
        .btn-primary-gradient {
          background: linear-gradient(135deg, #0d6efd, #0b5ed7);
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .btn-primary-gradient:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 15px rgba(13, 110, 253, 0.3);
        }
      `}</style>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-8 col-lg-5">
            <div className="card signin-card p-4 p-sm-5">
              
              {/* Header Icon & Title */}
              <div className="text-center mb-4">
                <div className="signin-header-icon">
                  <i className="bi bi-person-lock"></i>
                </div>
                <h3 className="fw-bold text-dark mb-1">Welcome Back</h3>
                <p className="text-muted small">Please sign in to access your account</p>
              </div>

              {/* Dynamic Alert Messages */}
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

              {/* Sign In Form */}
              <form onSubmit={handlesubmit}>
                {/* Email Field */}
                <div className="mb-3">
                  <label className="form-label text-secondary small fw-bold">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-envelope"></i>
                    </span>
                    <input
                      type="email"
                      className="form-control border-start-0 ps-0"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="mb-2">
                  <label className="form-label text-secondary small fw-bold">Password</label>
                  <div className="input-group">
                    <span className="input-group-text text-muted border-end-0">
                      <i className="bi bi-lock"></i>
                    </span>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control border-start-0 border-end-0 px-0"
                      placeholder="Enter your password"
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      className="btn btn-light border border-start-0 text-muted"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="-1"
                    >
                      <i className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                    </button>
                  </div>
                </div>

                {/* Forgot Password Link */}
                <div className="text-end mb-4">
                  <Link
                    to="/forgotpassword"
                    className="text-decoration-none small text-primary fw-semibold"
                  >
                    Forgot Password?
                  </Link>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="btn btn-primary-gradient w-100 py-2.5 rounded-3 fw-bold text-white shadow-sm"
                  disabled={!!loading}
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>

                {/* Footer Sign Up Link */}
                <div className="mt-4 text-center">
                  <p className="text-muted small mb-0">
                    Don't have an account?{" "}
                    <Link to="/signup" className="text-primary text-decoration-none fw-bold ms-1">
                      Sign Up
                    </Link>
                  </p>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;