import React, { useState } from "react";
import axios from "axios";

const AddCourseVacancy = () => {

    const [course, setCourse] = useState("");
    const [vacancies, setVacancies] = useState("");
    const [message, setMessage] = useState("");
    const [success, setSuccess] = useState(false);

    const saveVacancy = async (e) => {

        e.preventDefault();

        const formData = new FormData();

        formData.append("course", course);
        formData.append("vacancies", vacancies);

        try {

            const response = await axios.post(
                "https://abedhiggs.alwaysdata.net/sseapis/setvacancies.php",
                formData
            );

            setMessage(response.data.message);
            setSuccess(response.data.success);

            if (response.data.success) {
                setCourse("");
                setVacancies("");
            }

        } catch (error) {

            setSuccess(false);
            setMessage("Unable to save vacancies.");

        }

    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-9">
                    <div className="card shadow-lg border-0">
                        <div className="card-header bg-success text-white text-center">
                            <h2>
                                <i className="bi bi-journal-plus me-2"></i>
                                Add Course Vacancy
                            </h2>
                        </div>
                        <div className="card-body p-4">
                            {message && (
                                <div
                                    className={
                                        success
                                            ? "alert alert-success"
                                            : "alert alert-danger"
                                    }
                                >
                                    {message}
                                </div>
                            )}
                            <form onSubmit={saveVacancy}>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Select Course
                                    </label>
                                    <select
                                        className="form-select"
                                        value={course}
                                        onChange={(e) =>
                                            setCourse(e.target.value)
                                        }
                                        required
                                    >
                                        <option value="">
                                            ---- Choose Course ----
                                        </option>
                                        <optgroup label="Financial Applications">
                                            <option>
                                                QuickBooks
                                            </option>
                                            <option>
                                                Tally
                                            </option>
                                            <option>
                                                Sun Microsystems
                                            </option>
                                            <option>
                                                Sage
                                            </option>
                                        </optgroup>
                                        <optgroup label="Basic Computer Applications">
                                            <option>
                                                Introduction to Computers
                                            </option>
                                            <option>
                                                Operating System
                                            </option>
                                            <option>
                                                Word Processor
                                            </option>
                                            <option>
                                                Spreadsheet
                                            </option>
                                            <option>
                                                Publications
                                            </option>
                                            <option>
                                                Database
                                            </option>
                                            <option>
                                                Presentation Software
                                            </option>
                                            <option>
                                                Basic Computer Installation
                                            </option>
                                        </optgroup>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-bold">
                                        Total Vacancies
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter number of vacancies"
                                        min="1"
                                        value={vacancies}
                                        onChange={(e) =>
                                            setVacancies(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <button
                                    className="btn btn-success w-100 py-2"
                                    type="submit"
                                >
                                    <i className="bi bi-save me-2"></i>
                                    Save Vacancy
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCourseVacancy;