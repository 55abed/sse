import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState("");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [strength, setStrength] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    e.preventDefault();
    setLoading("Please wait.....");
    setError("");
    setSuccess("");

    const formdata = new FormData();
    formdata.append("username", username);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("phone", phone);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/signup.php",
        formdata
      );
      setLoading("");
      setSuccess(response.data.message);

      // Auto login only if signup is successful
      if (response.data.success) {
        localStorage.setItem(
          "user",
          JSON.stringify({
            username,
            email,
            role: "user",
            isLoggedIn: true,
          })
        );
        navigate("/home");
      }
    } catch (error) {
      setLoading("");
      setError(error.message);
    }
  };

  const checkPasswordStrength = (password) => {
    if (password.length === 0) {
      setStrength("");
    } else if (password.length < 4) {
      setStrength("Weak");
    } else if (password.length < 8) {
      setStrength("Medium");
    } else {
      setStrength("Strong");
    }
  };

  // Utility helpers for visual password meter styling
  const getStrengthBadgeClass = () => {
    switch (strength) {
      case "Weak":
        return "bg-danger";
      case "Medium":
        return "bg-warning text-dark";
      case "Strong":
        return "bg-success";
      default:
        return "bg-secondary";
    }
  };

  const getStrengthBarWidth = () => {
    switch (strength) {
      case "Weak":
        return "33%";
      case "Medium":
        return "66%";
      case "Strong":
        return "100%";
      default:
        return "0%";
    }
  };

  return (
    <div className="container py-5">
      {/* Custom Styles */}
      <style>{`
        .auth-card {
          border: none;
          border-radius: 1.25rem;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          background: #ffffff;
        }
        .auth-btn {
          background: linear-gradient(135deg, #0d6efd, #0a58ca);
          border: none;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .auth-btn:hover {
          background: linear-gradient(135deg, #0a58ca, #084298);
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(13, 110, 253, 0.3);
        }
        .form-control:focus {
          box-shadow: none;
          border-color: #0d6efd;
        }
      `}</style>

      <div className="row justify-content-center align-items-center min-vh-100 mt-n5">
        <div className="col-12 col-md-8 col-lg-5">
          <div className="card auth-card p-4 p-md-5">
            
            {/* Header Icon & Title */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
                style={{ width: "60px", height: "60px" }}
              >
                <i className="bi bi-person-plus-fill fs-3"></i>
              </div>
              <h3 className="fw-bold text-dark mb-1">Create an Account</h3>
              <p className="text-muted small">
                Sign up to start shopping with us today
              </p>
            </div>

            {/* Alert Status Banners */}
            {loading && (
              <div
                className="alert alert-info d-flex align-items-center rounded-3 py-2 px-3 mb-3"
                role="alert"
              >
                <div
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                ></div>
                <span className="small fw-semibold">{loading}</span>
              </div>
            )}

            {success && (
              <div
                className="alert alert-success d-flex align-items-center rounded-3 py-2 px-3 mb-3"
                role="alert"
              >
                <i className="bi bi-check-circle-fill me-2 fs-6"></i>
                <span className="small fw-semibold">{success}</span>
              </div>
            )}

            {error && (
              <div
                className="alert alert-danger d-flex align-items-center rounded-3 py-2 px-3 mb-3"
                role="alert"
              >
                <i className="bi bi-exclamation-triangle-fill me-2 fs-6"></i>
                <span className="small fw-semibold">{error}</span>
              </div>
            )}

            {/* Signup Form */}
            <form onSubmit={handlesubmit}>
              
              {/* Username Input */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  Username
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-person"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Enter username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Email Input */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-envelope"></i>
                  </span>
                  <input
                    type="email"
                    className="form-control border-start-0 ps-0"
                    placeholder="Enter email address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Phone Input */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  Phone Number
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-telephone"></i>
                  </span>
                  <input
                    type="tel"
                    className="form-control border-start-0 ps-0"
                    placeholder="Enter phone number"
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="mb-3">
                <label className="form-label text-secondary small fw-bold">
                  Password
                </label>
                <div className="input-group">
                  <span className="input-group-text bg-light text-muted border-end-0">
                    <i className="bi bi-lock"></i>
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control border-start-0 border-end-0 ps-0"
                    placeholder="Enter password"
                    onChange={(e) => {
                      setPassword(e.target.value);
                      checkPasswordStrength(e.target.value);
                    }}
                    required
                  />
                  <button
                    type="button"
                    className="btn btn-light border border-start-0 text-muted"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i
                      className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"}
                    ></i>
                  </button>
                </div>

                {/* Password Strength Progress Indicator */}
                {password && (
                  <div className="mt-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small
                        className="text-muted"
                        style={{ fontSize: "0.75rem" }}
                      >
                        Password Strength
                      </small>
                      <span
                        className={`badge ${getStrengthBadgeClass()} fw-bold`}
                        style={{ fontSize: "0.7rem" }}
                      >
                        {strength}
                      </span>
                    </div>
                    <div className="progress" style={{ height: "4px" }}>
                      <div
                        className={`progress-bar ${getStrengthBadgeClass()}`}
                        role="progressbar"
                        style={{
                          width: getStrengthBarWidth(),
                          transition: "width 0.3s ease",
                        }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn auth-btn text-white w-100 py-2.5 rounded-3 fw-bold shadow-sm mt-3 mb-3"
                disabled={!!loading}
              >
                {loading ? "Creating Account..." : "Sign Up"}
              </button>

              {/* Navigation Link */}
              <div className="text-center pt-2">
                <p className="text-muted small mb-0">
                  Already have an account?{" "}
                  <Link
                    to="/signin"
                    className="text-primary text-decoration-none fw-bold"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;