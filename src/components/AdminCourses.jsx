import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AdminCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const navigate = useNavigate();

  const getCourses = async () => {
    setLoading("Loading courses...");
    setError("");

    try {
      const response = await axios.get("https://abedhiggs.alwaysdata.net/sseapis/getcourses.php");

      if (response.data.success) {
        setCourses(response.data.courses);
      } else {
        setCourses([]);
        setError("No courses found.");
      }
      setLoading("");
    } catch (err) {
      console.log(err);
      setLoading("");
      setError("Unable to load courses.");
    }
  };

  useEffect(() => {
    getCourses();
  }, []);

  const editCourse = (course) => {
    navigate("/editvacancies", {
      state: { course },
    });
  };

  const filteredCourses = courses.filter((course) =>
    course.course?.toLowerCase().includes(search.toLowerCase())
  );

  const totalCourses = courses.length;

  const totalVacancies = courses.reduce(
    (sum, course) => sum + Number(course.total_vacancies || 0),
    0
  );

  const remainingVacancies = courses.reduce(
    (sum, course) => sum + Number(course.remaining_vacancies || 0),
    0
  );

  return (
    <div className="container mt-4">
      <h2 className="text-success mb-4 text-center">Course Vacancy Management</h2>

      {/* Dashboard Summary Cards */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card shadow border-0 bg-primary text-white">
            <div className="card-body text-center">
              <h5>Total Courses</h5>
              <h2>{totalCourses}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 bg-success text-white">
            <div className="card-body text-center">
              <h5>Total Vacancies</h5>
              <h2>{totalVacancies}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow border-0 bg-warning">
            <div className="card-body text-center">
              <h5>Remaining Vacancies</h5>
              <h2>{remainingVacancies}</h2>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar + Add New Vacancy Button */}
      <div className="d-flex justify-content-between mb-3">
        <input
          type="search"
          className="form-control w-50"
          placeholder="Search course..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Updated Route Navigation */}
        <button
          className="btn btn-success fw-bold"
          onClick={() => navigate("/addcoursevacancy")}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Vacancy
        </button>
      </div>

      {loading && <div className="alert alert-info">{loading}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      {/* Courses Table */}
      <div className="card shadow">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover table-bordered align-middle">
              <thead className="table-dark text-center">
                <tr>
                  <th>#</th>
                  <th>Course</th>
                  <th>Total Vacancies</th>
                  <th>Remaining</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody className="text-center">
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((course, index) => (
                    <tr key={course.id || index}>
                      <td>{index + 1}</td>
                      <td>
                        <strong>{course.course}</strong>
                      </td>
                      <td>{course.total_vacancies}</td>
                      <td>
                        {course.remaining_vacancies > 0 ? (
                          <span className="badge bg-success fs-6">
                            {course.remaining_vacancies}
                          </span>
                        ) : (
                          <span className="badge bg-danger fs-6">Full</span>
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => editCourse(course)}
                        >
                          <i className="bi bi-pencil-square me-2"></i>
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3">
                      No courses found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourses;