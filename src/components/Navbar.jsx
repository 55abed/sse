import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user: propUser }) => {
  const [user, setUser] = useState(propUser || null);
  const navigate = useNavigate();
  const location = useLocation();

  // Keep state synced with App.js prop and localStorage updates
  useEffect(() => {
    if (propUser !== undefined) {
      setUser(propUser);
    } else {
      const loggedUser = JSON.parse(localStorage.getItem("user"));
      setUser(loggedUser);
    }
  }, [propUser]);

  // Handle smooth scrolling when location hash changes across routes
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      setTimeout(() => {
        let element = document.getElementById(targetId);
        if (!element) {
          if (targetId === "get-in-touch") element = document.getElementById("contact");
          if (targetId === "contact") element = document.getElementById("get-in-touch");
        }
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location]);

  // Helper function to handle hash clicks directly on both "/" and "/home"
  const handleHashClick = (e, hashId) => {
    e.preventDefault();
    const isHomePage = location.pathname === "/home" || location.pathname === "/";

    let element = document.getElementById(hashId);
    if (!element) {
      if (hashId === "get-in-touch") element = document.getElementById("contact");
      if (hashId === "contact") element = document.getElementById("get-in-touch");
    }

    if (isHomePage && element) {
      element.scrollIntoView({ behavior: "smooth" });
      window.history.pushState(null, "", `${location.pathname}#${hashId}`);
    } else {
      navigate(`/home#${hashId}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("cart");
    setUser(null);
    window.dispatchEvent(new Event("userChange"));
    navigate("/signin");
  };

  const isActive = (path) => {
    if (path === "/home") {
      return location.pathname === "/home" || location.pathname === "/";
    }
    return location.pathname === path;
  };

  return (
    <>
      <style>{`
        .custom-navbar {
          background: rgba(15, 23, 42, 0.88) !important;
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          transition: all 0.3s ease;
        }

        .logo-container {
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.9), rgba(30, 41, 59, 0.8));
          border: 1px solid rgba(20, 184, 166, 0.3);
          border-radius: 14px;
          padding: 6px 12px;
          box-shadow: 0 0 15px rgba(13, 148, 136, 0.25);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .logo-container:hover {
          transform: translateY(-1px) scale(1.02);
          border-color: rgba(45, 212, 191, 0.6);
          box-shadow: 0 0 22px rgba(20, 184, 166, 0.45);
        }

        .nav-link-custom {
          color: rgba(241, 245, 249, 0.85) !important;
          font-weight: 500;
          padding: 8px 16px !important;
          border-radius: 9999px;
          transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .nav-link-custom:hover {
          color: #ffffff !important;
          background: rgba(255, 255, 255, 0.08);
          transform: translateY(-1px);
        }
        .nav-link-custom.active-link {
          color: #2dd4bf !important;
          background: rgba(20, 184, 166, 0.12);
          font-weight: 600;
        }

        .glass-dropdown {
          background: rgba(15, 23, 42, 0.95) !important;
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255, 255, 255, 0.1) !important;
          border-radius: 16px !important;
          padding: 8px !important;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4) !important;
        }
        .glass-dropdown .dropdown-item {
          color: rgba(241, 245, 249, 0.85);
          border-radius: 10px;
          padding: 10px 14px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
        }
        .glass-dropdown .dropdown-item:hover {
          background: rgba(20, 184, 166, 0.15) !important;
          color: #2dd4bf !important;
          transform: translateX(4px);
        }

        .btn-glass-cart {
          background: rgba(245, 158, 11, 0.12);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          padding: 6px 16px;
          font-weight: 500;
          transition: all 0.25s ease;
        }
        .btn-glass-cart:hover {
          background: rgba(245, 158, 11, 0.25);
          color: #fef08a;
          box-shadow: 0 0 15px rgba(245, 158, 11, 0.3);
          transform: translateY(-1px);
        }

        .btn-glass-primary {
          background: linear-gradient(135deg, #0d9488, #0f766e);
          color: #ffffff;
          border: none;
          border-radius: 9999px;
          padding: 7px 18px;
          font-weight: 600;
          box-shadow: 0 4px 14px rgba(13, 148, 136, 0.4);
          transition: all 0.25s ease;
        }
        .btn-glass-primary:hover {
          background: linear-gradient(135deg, #14b8a6, #0d9488);
          color: #ffffff;
          box-shadow: 0 6px 20px rgba(20, 184, 166, 0.5);
          transform: translateY(-2px);
        }

        .btn-glass-outline {
          background: rgba(255, 255, 255, 0.05);
          color: #f1f5f9;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 9999px;
          padding: 6px 16px;
          font-weight: 500;
          transition: all 0.25s ease;
        }
        .btn-glass-outline:hover {
          background: rgba(255, 255, 255, 0.15);
          color: #ffffff;
          transform: translateY(-1px);
        }
      `}</style>

      <nav className="navbar navbar-expand-lg navbar-dark sticky-top custom-navbar py-2">
        <div className="container-fluid px-lg-4">
          <Link
            to="/home"
            className="navbar-brand d-flex align-items-center text-decoration-none logo-container"
            style={{ gap: "12px" }}
          >
            <svg
              width="36"
              height="40"
              viewBox="0 0 100 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0px 2px 6px rgba(13, 148, 136, 0.5))" }}
            >
              <defs>
                <linearGradient id="topSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#38bdf8" />
                  <stop offset="100%" stopColor="#0284c7" />
                </linearGradient>
                <linearGradient id="midSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2dd4bf" />
                  <stop offset="100%" stopColor="#0d9488" />
                </linearGradient>
                <linearGradient id="botSwoosh" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" />
                  <stop offset="100%" stopColor="#0f766e" />
                </linearGradient>
              </defs>
              <path d="M 45 5 C 48 30, 78 35, 68 62 C 60 48, 42 35, 45 5 Z" fill="url(#topSwoosh)" />
              <path d="M 32 28 C 38 52, 78 58, 66 88 C 55 72, 30 56, 32 28 Z" fill="url(#midSwoosh)" />
              <path d="M 22 52 C 28 78, 76 82, 64 115 C 50 96, 18 78, 22 52 Z" fill="url(#botSwoosh)" />
            </svg>

            <div className="d-flex flex-column justify-content-center">
              <span
                className="fw-extrabold lh-1"
                style={{
                  color: "#2dd4bf",
                  fontSize: "1.2rem",
                  letterSpacing: "-0.3px",
                  textShadow: "0 0 10px rgba(45,212,191,0.3)"
                }}
              >
                Stanley &amp; Edricks
              </span>
              <span
                className="text-uppercase fw-semibold"
                style={{
                  color: "#94a3b8",
                  letterSpacing: "2px",
                  fontSize: "0.65rem",
                  marginTop: "3px"
                }}
              >
                Consultants
              </span>
            </div>
          </Link>

          <button
            className="navbar-toggler border-0 shadow-none p-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center gap-1 my-2 my-lg-0">
              <li className="nav-item dropdown position-relative">
                <a
                  href="/#"
                  className={`nav-link dropdown-toggle nav-link-custom ${
                    isActive("/home") ? "active-link" : ""
                  }`}
                  id="homeDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  data-bs-display="static"
                  onClick={(e) => e.preventDefault()}
                >
                  <i className="bi bi-house-door me-1"></i>
                  Home
                </a>

                <ul
                  className="dropdown-menu dropdown-menu-start glass-dropdown mt-2"
                  aria-labelledby="homeDropdown"
                  style={{ minWidth: "240px" }}
                >
                  <li>
                    <Link className="dropdown-item" to="/home">
                      <div className="rounded-circle p-1 me-2 bg-info bg-opacity-10 text-info">
                        <i className="bi bi-house-fill"></i>
                      </div>
                      Home Overview
                    </Link>
                  </li>
                  <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                  <li>
                    <a className="dropdown-item" href="#financial" onClick={(e) => handleHashClick(e, "financial")}>
                      <div className="rounded-circle p-1 me-2 bg-success bg-opacity-10 text-success">
                        <i className="bi bi-cash-stack"></i>
                      </div>
                      Financial Apps
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#basic" onClick={(e) => handleHashClick(e, "basic")}>
                      <div className="rounded-circle p-1 me-2 bg-primary bg-opacity-10 text-primary">
                        <i className="bi bi-laptop"></i>
                      </div>
                      Computer Basics
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#shop" onClick={(e) => handleHashClick(e, "shop")}>
                      <div className="rounded-circle p-1 me-2 bg-danger bg-opacity-10 text-danger">
                        <i className="bi bi-shop"></i>
                      </div>
                      Shop Products
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#get-in-touch" onClick={(e) => handleHashClick(e, "get-in-touch")}>
                      <div className="rounded-circle p-1 me-2 bg-warning bg-opacity-10 text-warning">
                        <i className="bi bi-envelope-fill"></i>
                      </div>
                      Get In Touch
                    </a>
                  </li>
                </ul>
              </li>

              <li className="nav-item">
                <Link to="/cyber" className={`nav-link nav-link-custom ${isActive("/cyber") ? "active-link" : ""}`}>
                  <i className="bi bi-pc-display-horizontal me-1"></i> Cyber
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/computer-services" className={`nav-link nav-link-custom ${isActive("/computer-services") ? "active-link" : ""}`}>
                  <i className="bi bi-cpu me-1"></i> Computer Services
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/blog" className={`nav-link nav-link-custom ${isActive("/blog") ? "active-link" : ""}`}>
                  <i className="bi bi-journal-richtext me-1"></i> Blog
                </Link>
              </li>

              <li className="nav-item">
                <Link to="/faq" className={`nav-link nav-link-custom ${isActive("/faq") ? "active-link" : ""}`}>
                  <i className="bi bi-question-circle me-1"></i> FAQ
                </Link>
              </li>

              {user && user.role === "admin" && (
                <li className="nav-item dropdown position-relative">
                  <a
                    href="/#"
                    className="nav-link dropdown-toggle nav-link-custom text-warning fw-bold"
                    id="adminDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                    onClick={(e) => e.preventDefault()}
                    style={{ background: "rgba(245, 158, 11, 0.1)" }}
                  >
                    <i className="bi bi-speedometer2 me-1 text-warning"></i> Admin
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end glass-dropdown mt-2">
                    <li>
                      <Link className="dropdown-item" to="/addproducts">
                        <i className="bi bi-box-seam me-2 text-warning"></i> Products
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/courses">
                        <i className="bi bi-mortarboard me-2 text-warning"></i> Courses
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/admin/service-requests">
                        <i className="bi bi-tools me-2 text-warning"></i> Service Requests
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/applications">
                        <i className="bi bi-people me-2 text-warning"></i> Applications
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/adminpreorders">
                        <i className="bi bi-receipt me-2 text-warning"></i> Pre-Orders
                      </Link>
                    </li>
                  </ul>
                </li>
              )}
            </ul>

            <div className="d-flex align-items-center ms-lg-3 gap-2 mt-3 mt-lg-0 pt-3 pt-lg-0 border-top border-lg-0 border-secondary border-opacity-25">
              {(!user || user.role !== "admin") && (
                <Link to="/cart" className="btn btn-glass-cart btn-sm">
                  <i className="bi bi-cart3 me-1"></i> Cart
                </Link>
              )}

              {user ? (
                <div className="dropdown position-relative">
                  <button
                    className="btn btn-glass-primary btn-sm dropdown-toggle d-flex align-items-center gap-2"
                    type="button"
                    data-bs-toggle="dropdown"
                    data-bs-display="static"
                  >
                    <i className="bi bi-person-circle fs-6"></i>
                    <span>{user.username}</span>
                  </button>
                  <ul className="dropdown-menu dropdown-menu-end glass-dropdown mt-2">
                    <li className="px-3 py-2">
                      <div className="text-muted small" style={{ color: "#94a3b8" }}>Signed in as</div>
                      <div className="fw-bold text-light">{user.username}</div>
                    </li>
                    <li><hr className="dropdown-divider border-secondary opacity-25" /></li>
                    <li>
                      <button className="dropdown-item text-danger" onClick={logout}>
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </div>
              ) : (
                <div className="d-flex align-items-center gap-2">
                  <Link to="/signin" className="btn btn-glass-outline btn-sm">Sign In</Link>
                  <Link to="/signup" className="btn btn-glass-primary btn-sm">Sign Up</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;