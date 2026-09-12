import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Application = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const course = searchParams.get("course");

  const [vacancies, setVacancies] = useState(0);
  const [loadingVacancies, setLoadingVacancies] = useState(true);

  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [submittedApplication, setSubmittedApplication] = useState(null);

  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    user_id: "",
    fullname: "",
    email: "",
    phone: "",
    idnumber: "",
    gender: "",
    dob: "",
    county: "",
    education: "",
    nextofkin: "",
    nextphone: "",
    reason: ""
  });

  // Fetch status on initial render
  const checkStatus = useCallback(async (email) => {
    if (!email) return;
    try {
      const res = await axios.get(
        `https://abedhiggs.alwaysdata.net/sseapis/checkstatus.php?email=${encodeURIComponent(email)}`
      );
      if (res.data && res.data.exists) {
        setSubmittedApplication(res.data.application);
        setHasSubmitted(true);
      }
    } catch (err) {
      console.error("Status check failed:", err);
    }
  }, []);

  // Hydrate user data from localStorage
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const user = JSON.parse(storedUser);
        const userEmail = user.email || "";
        setFormData((prev) => ({
          ...prev,
          user_id: user.id || user.user_id || "",
          fullname: user.fullname || user.name || "",
          email: userEmail
        }));
        if (userEmail) checkStatus(userEmail);
      }
    } catch (e) {
      console.error("Failed to parse user session", e);
    }
  }, [checkStatus]);

  // Fetch vacancies count
  useEffect(() => {
    if (!course) return;
    setLoadingVacancies(true);
    axios
      .get(`https://abedhiggs.alwaysdata.net/sseapis/getvacancies.php?course=${encodeURIComponent(course)}`)
      .then((res) => {
        if (res.data && res.data.success) {
          setVacancies(res.data.vacancies);
        } else {
          setVacancies(0);
        }
      })
      .catch(() => setVacancies(0))
      .finally(() => setLoadingVacancies(false));
  }, [course]);

  // Handle Form Inputs
  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Age validator
  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const month = today.getMonth() - birthDate.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading("");
    setError("");

    if (vacancies <= 0) {
      setError("This course has no remaining vacancies.");
      return;
    }

    if (calculateAge(formData.dob) < 16) {
      setError("Applicants must be at least 16 years old.");
      return;
    }

    if (!/^254\d+$/.test(formData.phone) || !/^254\d+$/.test(formData.nextphone)) {
      setError("Phone numbers must begin with 254 (e.g., 254712345678).");
      return;
    }

    setLoading("Submitting your application...");

    const body = new FormData();
    Object.keys(formData).forEach((key) => body.append(key, formData[key]));
    body.append("course", course || "");

    try {
      const res = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/apply.php", body);
      setLoading("");

      if (res.data && res.data.success) {
        setSubmittedApplication({
          course: course,
          status: "Pending",
          total_fee: 0,
          fee_balance: 0,
          fee_status: "Pending"
        });
        setHasSubmitted(true);
      } else {
        setError(res.data?.message || "Submission failed. Please try again.");
      }
    } catch (err) {
      setLoading("");
      setError("Network or server error during submission.");
    }
  };

  const status = submittedApplication?.status || "Pending";

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-success text-white text-center py-3">
              <h3 className="fw-bold mb-0">Course Application</h3>
              <p className="mb-0 opacity-75">{course || "General Form"}</p>
            </div>

            <div className="card-body p-4">
              {hasSubmitted && submittedApplication ? (
                <div className="py-3 text-center">
                  {status === "Pending" ? (
                    <div>
                      <div className="spinner-border text-warning mb-3" role="status"></div>
                      <h4 className="fw-bold">Application Received!</h4>
                      <p className="text-muted">
                        Your application for <strong>{submittedApplication.course}</strong> is currently pending admin review.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <i className="bi bi-check-circle-fill text-success display-4 mb-2 d-block"></i>
                      <h4 className="fw-bold">Application Approved!</h4>
                      <div className="card bg-light border-0 p-3 my-3">
                        <div className="row text-center">
                          <div className="col-4">
                            <small className="text-muted d-block">Total Fee</small>
                            <strong>KSH {Number(submittedApplication.total_fee || 0).toLocaleString()}</strong>
                          </div>
                          <div className="col-4">
                            <small className="text-muted d-block">Status</small>
                            <span className="badge bg-success">{submittedApplication.fee_status || "Pending"}</span>
                          </div>
                          <div className="col-4">
                            <small className="text-muted d-block">Balance</small>
                            <strong className="text-danger">KSH {Number(submittedApplication.fee_balance || 0).toLocaleString()}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="mt-4">
                    <button className="btn btn-outline-secondary me-2 rounded-pill" onClick={() => navigate(-1)}>
                      ← Back
                    </button>
                    <Link to="/my-applications" className="btn btn-success rounded-pill">
                      View All Applications
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {loadingVacancies ? (
                    <div className="alert alert-info py-2">Checking course vacancies...</div>
                  ) : (
                    <div className={`alert ${vacancies > 0 ? "alert-success" : "alert-danger"} py-2`}>
                      {vacancies > 0 ? `Available Vacancies: ${vacancies}` : "This course is currently full."}
                    </div>
                  )}

                  {loading && <div className="alert alert-primary py-2">{loading}</div>}
                  {error && <div className="alert alert-danger py-2">{error}</div>}

                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name</label>
                      <input type="text" className="form-control" name="fullname" value={formData.fullname} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email Address</label>
                      <input type="email" className="form-control" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone (254...)</label>
                      <input type="text" className="form-control" name="phone" value={formData.phone} onChange={handleChange} placeholder="2547..." required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">National ID / Passport</label>
                      <input type="text" className="form-control" name="idnumber" value={formData.idnumber} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Gender</label>
                      <select className="form-select" name="gender" value={formData.gender} onChange={handleChange} required>
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Date of Birth</label>
                      <input type="date" className="form-control" name="dob" value={formData.dob} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">County</label>
                      <input type="text" className="form-control" name="county" value={formData.county} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Education Level</label>
                      <select className="form-select" name="education" value={formData.education} onChange={handleChange} required>
                        <option value="">Select Education</option>
                        <option value="Primary">Primary</option>
                        <option value="KCSE">KCSE</option>
                        <option value="Certificate">Certificate</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Degree">Degree</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Next of Kin Name</label>
                      <input type="text" className="form-control" name="nextofkin" value={formData.nextofkin} onChange={handleChange} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Next of Kin Phone</label>
                      <input type="text" className="form-control" name="nextphone" value={formData.nextphone} onChange={handleChange} placeholder="2547..." required />
                    </div>
                    <div className="col-12">
                      <label className="form-label">Reason for Applying</label>
                      <textarea className="form-control" rows="3" name="reason" value={formData.reason} onChange={handleChange} required></textarea>
                    </div>
                  </div>

                  <div className="d-flex justify-content-between mt-4">
                    <button type="button" className="btn btn-secondary rounded-pill px-4" onClick={() => navigate(-1)}>
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success rounded-pill px-5" disabled={vacancies <= 0}>
                      Submit Application
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Application;