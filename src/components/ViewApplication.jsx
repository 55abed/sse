import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const ViewApplication = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const [application, setApplication] = useState(null);
    const [loading, setLoading] = useState("Loading application...");
    const loadApplication = useCallback(() => {
        axios
            .get(`https://abedhiggs.alwaysdata.net/sseapis/getapplication.php?id=${id}`)
            .then((response) => {
                if (response.data.success) {
                    setApplication(response.data.application);
                } else {
                    alert(response.data.message);
                }

                setLoading("");
            })
            .catch(() => {
                setLoading("");
                alert("Unable to load application.");
            });
    }, [id]);
    useEffect(() => {
        loadApplication();
    }, [loadApplication]);
    const updateStatus = (status) => {
        if (
            !window.confirm(
                `Are you sure you want to ${status.toLowerCase()} this application?`
            )
        ) {
            return;
        }
        axios
            .post(
                "https://abedhiggs.alwaysdata.net/sseapis/updateapplicationstatus.php",
                {
                    id: application.id,
                    status: status,
                }
            )
            .then((response) => {
                alert(response.data.message);
                loadApplication();
            })
            .catch(() => {
                alert("Unable to update application.");
            });
    };
    if (loading !== "") {
        return (
            <div className="container mt-5">
                <h3 className="text-center">{loading}</h3>
            </div>
        );
    }
    if (!application) {
        return (
            <div className="container mt-5">
                <h3 className="text-danger text-center">
                    Application not found.
                </h3>
            </div>
        );
    }
    return (
        <div className="container mt-5 mb-5">
            <div className="card shadow">
                <div className="card-header bg-success text-white">
                    <h3>Student Application</h3>
                </div>
                <div className="card-body">
                    <table className="table table-bordered">
                        <tbody>
                            <tr>
                                <th>Course</th>
                                <td>{application.course}</td>
                            </tr>
                            <tr>
                                <th>Full Name</th>
                                <td>{application.fullname}</td>
                            </tr>
                            <tr>
                                <th>Email</th>
                                <td>{application.email}</td>
                            </tr>
                            <tr>
                                <th>Phone</th>
                                <td>{application.phone}</td>
                            </tr>
                            <tr>
                                <th>ID Number</th>
                                <td>{application.idnumber}</td>
                            </tr>
                            <tr>
                                <th>Gender</th>
                                <td>{application.gender}</td>
                            </tr>
                            <tr>
                                <th>Date of Birth</th>
                                <td>{application.dob}</td>
                            </tr>
                            <tr>
                                <th>County</th>
                                <td>{application.county}</td>
                            </tr>
                            <tr>
                                <th>Education</th>
                                <td>{application.education}</td>
                            </tr>
                            <tr>
                                <th>Next of Kin</th>
                                <td>{application.nextofkin}</td>
                            </tr>
                            <tr>
                                <th>Next of Kin Phone</th>
                                <td>{application.nextphone}</td>
                            </tr>
                            <tr>
                                <th>Reason</th>
                                <td>{application.reason}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    {application.status === "Accepted" && (
                                        <span className="badge bg-success">
                                            Accepted
                                        </span>
                                    )}
                                    {application.status === "Rejected" && (
                                        <span className="badge bg-danger">
                                            Rejected
                                        </span>
                                    )}
                                    {application.status === "Pending" && (
                                        <span className="badge bg-warning text-dark">
                                            Pending
                                        </span>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-between">
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                        >
                            Back
                        </button>

                        <div>
                            <button
                                className="btn btn-danger me-2"
                                onClick={() => updateStatus("Rejected")}
                            >
                                Reject
                            </button>

                            <button
                                className="btn btn-success"
                                onClick={() => updateStatus("Accepted")}
                            >
                                Accept
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ViewApplication;