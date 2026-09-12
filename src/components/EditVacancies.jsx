import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const EditVacancies = () => {
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  // Admin Modal Control
  const [showEnrollModal, setShowEnrollModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  // Student Form State
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    national_id: "",
    gender: "",
    dob: "",
    county: "",
    highest_education: "",
    next_of_kin: "",
    next_of_kin_phone: "",
    reason: "",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch course list from backend
  const fetchCourses = async () => {
    try {
      const response = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getcourses.php");
      if (response.data.success) {
        setCourses(response.data.courses || []);
      }
    } catch (err) {
      console.error("Error fetching courses:", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Compute live summary totals
  const totalCourses = courses.length;
  const totalVacancies = courses.reduce(
    (acc, curr) => acc + Number(curr.total_vacancies || 0),
    0
  );
  const totalRemaining = courses.reduce(
    (acc, curr) => acc + Number(curr.remaining_vacancies || 0),
    0
  );

  // Handle Input Changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Open Registration Modal for a selected course
  const handleOpenEnroll = (courseName) => {
    setSelectedCourse(courseName);
    setShowEnrollModal(true);
  };

  // Submit Admin Manual Application
  const handleManualEnrollSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const postData = new FormData();
    postData.append("user_role", user?.role || "admin");
    postData.append("course_name", selectedCourse);

    // Append all student fields
    Object.keys(formData).forEach((key) => {
      postData.append(key, formData[key]);
    });

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/enrollstudent.php",
        postData
      );

      if (response.data.success) {
        alert("Student record saved to database and 1 vacancy deducted!");
        setShowEnrollModal(false);
        // Reset form inputs
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          national_id: "",
          gender: "",
          dob: "",
          county: "",
          highest_education: "",
          next_of_kin: "",
          next_of_kin_phone: "",
          reason: "",
        });
        // Instantly refresh summary cards & table
        fetchCourses();
      } else {
        alert(response.data.message || "Failed to process enrollment.");
      }
    } catch (err) {
      alert("Server error processing registration.");
    } finally {
      setLoading(false);
    }
  };

  // Search filter
  const filteredCourses = courses.filter((item) =>
    item.course?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container py-4">
      {/* Title */}
      <h1 className="text-center text-success fw-bold mb-4">
        Course Vacancy Management
      </h1>

      {/* ================= TOP SUMMARY CARDS ================= */}
      <div className="row g-3 mb-4 text-white text-center">
        <div className="col-md-4">
          <div className="card bg-primary p-4 shadow-sm border-0">
            <h5>Total Courses</h5>
            <h2 className="fw-bold m-0">{totalCourses}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-success p-4 shadow-sm border-0">
            <h5>Total Vacancies</h5>
            <h2 className="fw-bold m-0">{totalVacancies}</h2>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card bg-warning text-dark p-4 shadow-sm border-0">
            <h5>Remaining Vacancies</h5>
            <h2 className="fw-bold m-0">{totalRemaining}</h2>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & ADD NEW ================= */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          className="btn btn-success fw-bold"
          onClick={() => navigate("/addcoursevacancy")}
        >
          + Add New Vacancy
        </button>
      </div>

      {/* ================= VACANCIES TABLE ================= */}
      <div className="card shadow-sm border-0">
        <div className="table-responsive">
          <table className="table table-striped align-middle mb-0 text-center">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Course</th>
                <th>Total Vacancies</th>
                <th>Remaining</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.length > 0 ? (
                filteredCourses.map((item, index) => (
                  <tr key={item.id || index}>
                    <td>{index + 1}</td>
                    <td className="fw-bold">{item.course}</td>
                    <td>{item.total_vacancies}</td>
                    <td>
                      <span
                        className={`badge ${
                          item.remaining_vacancies > 0
                            ? "bg-success"
                            : "bg-danger"
                        }`}
                      >
                        {item.remaining_vacancies}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-warning btn-sm fw-bold"
                        onClick={() => handleOpenEnroll(item.course)}
                        disabled={item.remaining_vacancies <= 0}
                      >
                        Manual Registration (-1)
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-4 text-muted">
                    No courses found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= ADMIN MANUAL APPLICATION FORM MODAL ================= */}
      {showEnrollModal && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title fw-bold">
                  Admin Registration Form — {selectedCourse}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowEnrollModal(false)}
                ></button>
              </div>

              <form onSubmit={handleManualEnrollSubmit}>
                {/* Scrollable Container Added Here */}
                <div 
                  className="modal-body bg-light text-start p-4"
                  style={{ maxHeight: "70vh", overflowY: "auto" }}
                >
                  <div className="row g-3">
                    {/* Full Name */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Full Name</label>
                      <input
                        type="text"
                        name="full_name"
                        className="form-control"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Email Address */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        className="form-control"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        className="form-control"
                        placeholder="07XXXXXXXX"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* National ID */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">National ID</label>
                      <input
                        type="text"
                        name="national_id"
                        className="form-control"
                        value={formData.national_id}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Gender */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Gender</label>
                      <select
                        name="gender"
                        className="form-select"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Date of Birth</label>
                      <input
                        type="date"
                        name="dob"
                        className="form-control"
                        value={formData.dob}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* County */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">County</label>
                      <input
                        type="text"
                        name="county"
                        className="form-control"
                        value={formData.county}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Highest Education */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Highest Education</label>
                      <select
                        name="highest_education"
                        className="form-select"
                        value={formData.highest_education}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Education Level</option>
                        <option value="High School">High School</option>
                        <option value="Diploma">Diploma</option>
                        <option value="Bachelors Degree">Bachelors Degree</option>
                        <option value="Masters Degree">Masters Degree</option>
                      </select>
                    </div>

                    {/* Next of Kin */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Next of Kin</label>
                      <input
                        type="text"
                        name="next_of_kin"
                        className="form-control"
                        value={formData.next_of_kin}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Next of Kin Phone */}
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Next of Kin Phone</label>
                      <input
                        type="tel"
                        name="next_of_kin_phone"
                        className="form-control"
                        placeholder="07XXXXXXXX"
                        value={formData.next_of_kin_phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    {/* Reason for Enrollment */}
                    <div className="col-12">
                      <label className="form-label fw-semibold">
                        Why do you want to enroll in this course?
                      </label>
                      <textarea
                        name="reason"
                        className="form-control"
                        rows="3"
                        placeholder="Tell us why you would like to join this course..."
                        value={formData.reason}
                        onChange={handleInputChange}
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowEnrollModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success fw-bold">
                    {loading ? "Submitting..." : "Submit Student & Deduct Vacancy"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditVacancies;