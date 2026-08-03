import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const Application = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const course = searchParams.get("course");

    const [vacancies, setVacancies] = useState(0);
    const [loadingVacancies, setLoadingVacancies] = useState(true);

    const [loading, setLoading] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const [formData, setFormData] = useState({
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

    const fetchVacancies = useCallback(async () => {
        setLoadingVacancies(true);
        try {
            const response = await axios.get(
                `https://abedhiggs.alwaysdata.net/sseapis/getvacancies.php?course=${course}`
            );

            if (response.data.success) {
                setVacancies(response.data.vacancies);
            } else {
                setVacancies(0);
            }
        } catch (err) {
            setVacancies(0);
        }
        setLoadingVacancies(false);
    }, [course]);

    useEffect(() => {
        fetchVacancies();
    }, [fetchVacancies]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();

        if (
            month < 0 ||
            (month === 0 && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    const submitApplication = async (e) => {
        e.preventDefault();

        setLoading("");
        setSuccess("");
        setError("");

        if (vacancies <= 0) {
            setError("Sorry, this course is already full.");
            return;
        }

        if (calculateAge(formData.dob) < 16) {
            setError("Applicants must be at least 16 years old.");
            return;
        }

        // Phone number must start with 254 (followed by any numbers)
        if (!/^254\d+$/.test(formData.phone)) {
            setError("Enter a valid phone number starting with 254.");
            return;
        }

        if (!/^254\d+$/.test(formData.nextphone)) {
            setError("Enter a valid Next of Kin phone number starting with 254.");
            return;
        }

        // ID number allows letters and numbers
        if (!/^[a-zA-Z0-9]{3,20}$/.test(formData.idnumber)) {
            setError("Enter a valid National ID or Passport number (letters and numbers allowed).");
            return;
        }

        setLoading("Submitting application...");

        const data = new FormData();
        data.append("course", course);
        data.append("fullname", formData.fullname);
        data.append("email", formData.email);
        data.append("phone", formData.phone);
        data.append("idnumber", formData.idnumber);
        data.append("gender", formData.gender);
        data.append("dob", formData.dob);
        data.append("county", formData.county);
        data.append("education", formData.education);
        data.append("nextofkin", formData.nextofkin);
        data.append("nextphone", formData.nextphone);
        data.append("reason", formData.reason);

        try {
            const response = await axios.post(
                "https://abedhiggs.alwaysdata.net/sseapis/apply.php",
                data
            );

            setLoading("");

            if (response.data.success) {
                setSuccess("Application submitted successfully.");
                setFormData({
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
                fetchVacancies();
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            setLoading("");
            setError("Unable to submit application. Please try again.");
        }
    };

    return (
        <div className="container mt-5 mb-5">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-success text-white text-center">
                            <h2>Course Application Form</h2>
                            <h5>{course}</h5>
                        </div>

                        <div className="card-body p-4">
                            {loadingVacancies ? (
                                <div className="alert alert-info">
                                    Loading available vacancies...
                                </div>
                            ) : vacancies > 0 ? (
                                <div className="alert alert-success">
                                    <strong>Remaining Vacancies:</strong> {vacancies}
                                </div>
                            ) : (
                                <div className="alert alert-danger">
                                    This course is currently full.
                                </div>
                            )}

                            {loading && <div className="alert alert-primary">{loading}</div>}
                            {success && <div className="alert alert-success">{success}</div>}
                            {error && <div className="alert alert-danger">{error}</div>}

                            <form onSubmit={submitApplication}>
                                <div className="row">
                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Full Name</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="fullname"
                                            value={formData.fullname}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Email Address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="254..."
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">National ID / Passport Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="idnumber"
                                            value={formData.idnumber}
                                            onChange={handleChange}
                                            placeholder="Numbers or letters"
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Gender</label>
                                        <select
                                            className="form-select"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="form-control"
                                            name="dob"
                                            value={formData.dob}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">County</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="county"
                                            value={formData.county}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Highest Education</label>
                                        <select
                                            className="form-select"
                                            name="education"
                                            value={formData.education}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="">Select Education Level</option>
                                            <option value="Primary">Primary</option>
                                            <option value="KCSE">KCSE</option>
                                            <option value="Certificate">Certificate</option>
                                            <option value="Diploma">Diploma</option>
                                            <option value="Degree">Degree</option>
                                            <option value="Masters">Masters</option>
                                        </select>
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Next of Kin</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nextofkin"
                                            value={formData.nextofkin}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>

                                    <div className="col-md-6 mb-3">
                                        <label className="form-label">Next of Kin Phone</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            name="nextphone"
                                            value={formData.nextphone}
                                            onChange={handleChange}
                                            placeholder="254..."
                                            required
                                        />
                                    </div>

                                    <div className="col-12 mb-4">
                                        <label className="form-label">Why do you want to enroll in this course?</label>
                                        <textarea
                                            className="form-control"
                                            rows="5"
                                            name="reason"
                                            value={formData.reason}
                                            onChange={handleChange}
                                            placeholder="Tell us why you would like to join this course..."
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="d-flex justify-content-between">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => navigate(-1)}
                                    >
                                        ← Back
                                    </button>

                                    <button
                                        type="submit"
                                        className="btn btn-success px-5"
                                        disabled={vacancies <= 0}
                                    >
                                        Submit Application
                                    </button>
                                </div>
                            </form>
                        </div>

                        <div className="card-footer text-center text-muted">
                            Stanley &amp; Edricks Consultants (S&amp;SE)
                            <br />
                            Thank you for choosing to study with us.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Application;