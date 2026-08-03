import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";

import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";

/* ===== Public Components ===== */
import Navbar from "./components/Navbar";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import ForgotPassword from "./components/Forgotpassword";
import Reset from "./components/Reset";
import Getproducts from "./components/Getproducts";
import Cart from "./components/Cart";
import Mpesapayment from "./components/Mpesapayment";
import Cyber from "./components/Cyber";
import Application from "./components/Application";
import Faq from "./components/Faq";
import MyOrders from "./components/MyOrders";
import Blog from "./components/Blog";
import ComputerServices from "./components/ComputerServices";

/* ===== Admin Components ===== */
import Addproducts from "./components/Addproducts";
import Editproducts from "./components/Editproducts";
import AddCourseVacancy from "./components/AddCourseVacancy";
import AdminCourses from "./components/AdminCourses";
import EditVacancies from "./components/EditVacancies";
import AdminApplications from "./components/AdminApplications";
import ViewApplication from "./components/ViewApplication";
import AdminPreorders from "./components/AdminPreorders";
import EditCyber from "./components/EditCyber";
import AdminServiceRequests from "./components/AdminServiceRequests";

// Helper component to handle reliable scrolling to section IDs across routes & dynamic renders
function ScrollToHash() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const targetId = hash.replace("#", "");

    const scrollToTarget = () => {
      let element = document.getElementById(targetId);
      if (!element) {
        if (targetId === "get-in-touch") element = document.getElementById("contact");
        if (targetId === "contact") element = document.getElementById("get-in-touch");
      }

      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      return false;
    };

    // 1. Initial immediate scroll attempt
    scrollToTarget();

    // 2. Poll for dynamic elements mounting late
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      const found = scrollToTarget();
      if (found || attempts >= 30) {
        clearInterval(interval);
      }
    }, 100);

    // 3. Monitor DOM shifts (prevents layout push-down from API calls in Getproducts)
    const observer = new MutationObserver(() => {
      scrollToTarget();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Auto-cleanup observer after 3 seconds when page layout stabilizes
    const timeout = setTimeout(() => {
      clearInterval(interval);
      observer.disconnect();
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      observer.disconnect();
    };
  }, [pathname, hash, key]);

  return null;
}

function App() {
  // 1. Keep track of the user state dynamically
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("user");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      console.error("Failed to parse user from localStorage:", error);
      return null;
    }
  });

  // 2. Listen for storage changes across tabs AND custom events within the same tab
  useEffect(() => {
    const handleUserUpdate = () => {
      try {
        const savedUser = localStorage.getItem("user");
        setUser(savedUser ? JSON.parse(savedUser) : null);
      } catch (error) {
        console.error("Error updating user state:", error);
        setUser(null);
      }
    };

    // Standard storage event for cross-tab updates
    window.addEventListener("storage", handleUserUpdate);
    // Custom event for instant same-tab login/logout updates
    window.addEventListener("userChange", handleUserUpdate);

    return () => {
      window.removeEventListener("storage", handleUserUpdate);
      window.removeEventListener("userChange", handleUserUpdate);
    };
  }, []);

  // 3. Clean helper wrapper for Admin-only routes
  const AdminRoute = ({ children }) => {
    if (!user || user.role !== "admin") {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  // 4. Clean helper wrapper for User-only routes (like payments)
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/signin" replace />;
    }
    return children;
  };

  return (
    <BrowserRouter>
      {/* Listens to route changes & scrolls to #hash elements */}
      <ScrollToHash />

      {/* Pass user state to Navbar for instant dynamic links */}
      <Navbar user={user} />
      
      <div className="container-fluid p-0">
        <Routes>
          {/* Default / Root Route: Directly renders Home Overview */}
          <Route path="/" element={<Getproducts />} />

          {/* Public Pages */}
          <Route path="/home" element={<Getproducts />} />
          <Route path="/get-in-touch" element={<Navigate to="/home#contact" replace />} />
          <Route path="/contact" element={<Navigate to="/home#contact" replace />} />
          <Route path="/cyber" element={<Cyber />} />
          <Route path="/blog" element={<Blog user={user} />} />
          <Route path="/computer-services" element={<ComputerServices user={user} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          
          {/* Supported both paths to ensure the email reset link works seamlessly */}
          <Route path="/reset" element={<Reset />} />
          <Route path="/resetpassword" element={<Reset />} />

          {/* Shopping & Application */}
          <Route path="/cart" element={<Cart />} />
          <Route path="/application" element={<Application />} />
          <Route path="/faq" element={<Faq />} />

          {/* Public / Unrestricted Purchase History Route */}
          <Route path="/my-orders" element={<MyOrders />} />

          {/* Protected Customer Routes */}
          <Route 
            path="/makepayment" 
            element={
              <ProtectedRoute>
                <Mpesapayment />
              </ProtectedRoute>
            } 
          />

          {/* ================= ADMIN: PRODUCTS ================= */}
          <Route path="/addproducts" element={<AdminRoute><Addproducts /></AdminRoute>} />
          <Route path="/editproduct" element={<AdminRoute><Editproducts /></AdminRoute>} />

          {/* ================= ADMIN: CYBER SERVICES ================= */}
          <Route path="/editcyber" element={<AdminRoute><EditCyber /></AdminRoute>} />

          {/* ================= ADMIN: COMPUTER SERVICE REQUESTS ================= */}
          <Route path="/admin/service-requests" element={<AdminRoute><AdminServiceRequests /></AdminRoute>} />

          {/* ================= ADMIN: COURSE VACANCIES ================= */}
          <Route path="/addcoursevacancy" element={<AdminRoute><AddCourseVacancy /></AdminRoute>} />
          <Route path="/courses" element={<AdminRoute><AdminCourses /></AdminRoute>} />
          <Route path="/editvacancies" element={<AdminRoute><EditVacancies /></AdminRoute>} />

          {/* ================= ADMIN: APPLICATIONS ================= */}
          <Route path="/applications" element={<AdminRoute><AdminApplications /></AdminRoute>} />
          <Route path="/viewapplication" element={<AdminRoute><ViewApplication /></AdminRoute>} />

          {/* ================= ADMIN: PRE-ORDERS ================= */}
          <Route path="/adminpreorders" element={<AdminRoute><AdminPreorders /></AdminRoute>} />

          {/* 404 - Fallback to Home overview */}
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;