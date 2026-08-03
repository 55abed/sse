import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const EditCyber = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Retrieve initial data passed from the cyber services list
    const initialData = location.state?.cyber || {
        service_id: "",
        service_name: "",
        service_description: "",
        service_cost: ""
    };

    const [serviceName, setServiceName] = useState(initialData.service_name || "");
    const [serviceDescription, setServiceDescription] = useState(initialData.service_description || "");
    const [serviceCost, setServiceCost] = useState(initialData.service_cost || "");

    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        const formdata = new FormData();
        formdata.append("service_id", initialData.service_id);
        formdata.append("service_name", serviceName);
        formdata.append("service_description", serviceDescription);
        formdata.append("service_cost", serviceCost);

        try {
            const response = await axios.post("https://abedhiggs.alwaysdata.net/sseapis/updatecyber.php", formdata);
            setLoading(false);
            if (response.data.success) {
                setSuccess(response.data.message || "Cyber service updated successfully!");
                setTimeout(() => {
                    navigate("/cyber");
                }, 1200);
            } else {
                setError(response.data.message || "Failed to update cyber service.");
            }
        } catch (err) {
            setLoading(false);
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-7">
                    {/* Navigation Back */}
                    <div className="mb-3">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-link text-decoration-none text-muted p-0 d-inline-flex align-items-center fw-semibold"
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back to Cyber Services
                        </button>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Header Banner */}
                        <div className="bg-primary bg-gradient text-white p-4 p-md-5 position-relative border-bottom border-light border-3">
                            <div className="position-absolute top-0 end-0 p-4 opacity-25 d-none d-sm-block">
                                <i className="bi bi-laptop display-3 text-white"></i>
                            </div>
                            <span className="badge bg-white text-primary fw-bold mb-2 px-3 py-2 rounded-pill">
                                <i className="bi bi-shield-lock me-1"></i> S&amp;SE Cyber Management
                            </span>
                            <h2 className="fw-bold mb-1 text-white">Edit Cyber Service</h2>
                            <p className="mb-0 text-white-50 small">Update service offering title, details, and pricing structure.</p>
                        </div>

                        <div className="card-body p-4 p-md-5 bg-white">
                            {success && (
                                <div className="alert alert-success d-flex align-items-center shadow-sm border-0 rounded-3 mb-4" role="alert">
                                    <i className="bi bi-check-circle-fill flex-shrink-0 me-2 fs-5"></i>
                                    <div>{success}</div>
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger d-flex align-items-center shadow-sm border-0 rounded-3 mb-4" role="alert">
                                    <i className="bi bi-exclamation-triangle-fill flex-shrink-0 me-2 fs-5"></i>
                                    <div>{error}</div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="needs-validation">
                                {/* Service Name */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        Service Name
                                    </label>
                                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-light border-0 text-muted ps-3">
                                            <i className="bi bi-laptop"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-light"
                                            placeholder="e.g., KRA Tax Returns Filing"
                                            value={serviceName}
                                            onChange={(e) => setServiceName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Service Description */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        Service Description
                                    </label>
                                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-light border-0 text-muted ps-3 align-items-start pt-3">
                                            <i className="bi bi-card-text"></i>
                                        </span>
                                        <textarea
                                            className="form-control border-0 bg-light"
                                            rows="4"
                                            placeholder="Describe what the cyber service entails..."
                                            value={serviceDescription}
                                            onChange={(e) => setServiceDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Service Cost */}
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        Service Cost (KSh)
                                    </label>
                                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-light border-0 text-primary fw-bold">
                                            KSh
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control border-0 bg-light fw-bold text-primary"
                                            placeholder="e.g., 500"
                                            value={serviceCost}
                                            onChange={(e) => setServiceCost(e.target.value)}
                                            required
                                            min="0"
                                            step="1"
                                        />
                                    </div>
                                </div>

                                <div className="d-grid gap-2 pt-3">
                                    <button
                                        className="btn btn-primary btn-lg shadow-sm fw-bold rounded-pill py-3 text-white d-flex justify-content-center align-items-center"
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating Service...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check2-circle me-2 fs-5"></i> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditCyber;