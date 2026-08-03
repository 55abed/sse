import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Editproducts = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Determine the entity type from state or query params (default to "product")
    const entityType = location.state?.type || "product"; // Options: "product", "shop", "cyber"

    // Configure schema fields and UI text dynamically based on the entity type
    const entityConfig = {
        product: {
            title: "Edit Product",
            subtitle: "Modify product inventory details and pricing",
            apiEndpoint: "https://abedhiggs.alwaysdata.net/sseapis/updateproduct.php",
            idField: "product_id",
            nameField: "product_name",
            descField: "product_description",
            priceField: "product_cost",
            successRedirect: "/home",
            themeColor: "success",
            icon: "bi-box-seam",
            nameLabel: "Product Name",
            priceLabel: "Price (KSH)",
            pricePrefix: "KSH",
        },
        shop: {
            title: "Edit Shop",
            subtitle: "Modify store profile, location, and operational details",
            apiEndpoint: "https://abedhiggs.alwaysdata.net/sseapis/updateshop.php",
            idField: "shop_id",
            nameField: "shop_name",
            descField: "shop_description",
            priceField: "shop_rent",
            successRedirect: "/shops",
            themeColor: "primary",
            icon: "bi-shop",
            nameLabel: "Shop Name",
            priceLabel: "Monthly Rent / Fee (KSH)",
            pricePrefix: "KSH",
        },
        cyber: {
            title: "Edit Cyber Cafe",
            subtitle: "Update cyber station metrics, services, and rates",
            apiEndpoint: "https://abedhiggs.alwaysdata.net/sseapis/updatecyber.php",
            idField: "cyber_id",
            nameField: "cyber_name",
            descField: "cyber_services",
            priceField: "hourly_rate",
            successRedirect: "/cybers",
            themeColor: "info",
            icon: "bi-pc-display",
            nameLabel: "Cyber Name",
            priceLabel: "Hourly Rate (KSH)",
            pricePrefix: "KSH",
        }
    };

    const config = entityConfig[entityType] || entityConfig.product;

    // Fallback safety checks if accessed directly without router state
    const initialData = location.state?.item || location.state?.product || location.state?.shop || location.state?.cyber || {
        [config.idField]: "",
        [config.nameField]: "",
        [config.descField]: "",
        [config.priceField]: ""
    };

    const [name, setName] = useState(initialData[config.nameField] || "");
    const [description, setDescription] = useState(initialData[config.descField] || "");
    const [price, setPrice] = useState(initialData[config.priceField] || "");
    
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setSuccess("");
        setError("");

        const formdata = new FormData();
        formdata.append(config.idField, initialData[config.idField]);
        formdata.append(config.nameField, name);
        formdata.append(config.descField, description);
        formdata.append(config.priceField, price);

        try {
            const response = await axios.post(config.apiEndpoint, formdata);
            setLoading(false);
            if (response.data.success) {
                setSuccess(response.data.message || `${config.title} updated successfully!`);
                setTimeout(() => {
                    navigate(config.successRedirect);
                }, 1200);
            } else {
                setError(response.data.message || `Failed to update ${entityType}.`);
            }
        } catch (err) {
            setLoading(false);
            setError("Unable to connect to the server.");
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-xl-6">
                    {/* Top Navigation Back Action */}
                    <div className="mb-3">
                        <button 
                            onClick={() => navigate(-1)} 
                            className="btn btn-link text-decoration-none text-muted p-0 d-inline-flex align-items-center fw-semibold"
                        >
                            <i className="bi bi-arrow-left me-2"></i> Back
                        </button>
                    </div>

                    <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                        {/* Header Banner dynamically styled based on themeColor */}
                        <div className={`bg-${config.themeColor} bg-gradient text-white p-4 text-center position-relative`}>
                            <div className="position-absolute top-0 end-0 p-3 opacity-25">
                                <i className={`bi ${config.icon} display-4`}></i>
                            </div>
                            <h2 className="fw-bold mb-1">{config.title}</h2>
                            <p className="mb-0 text-white-50 small">{config.subtitle}</p>
                        </div>

                        <div className="card-body p-4 p-md-5 bg-white">
                            {/* Feedback Alerts */}
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
                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        {config.nameLabel}
                                    </label>
                                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-light border-0 text-muted ps-3">
                                            <i className="bi bi-tag"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control border-0 bg-light fs-6"
                                            placeholder={`Enter ${entityType} name`}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        Description / Services
                                    </label>
                                    <div className="input-group shadow-sm rounded-3 overflow-hidden">
                                        <textarea
                                            className="form-control border-0 bg-light fs-6 p-3"
                                            rows="4"
                                            placeholder={`Provide details or descriptions for this ${entityType}...`}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                        ></textarea>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-bold text-secondary small text-uppercase tracking-wider">
                                        {config.priceLabel}
                                    </label>
                                    <div className="input-group input-group-lg shadow-sm rounded-3 overflow-hidden">
                                        <span className="input-group-text bg-light border-0 text-muted ps-3 fw-bold">
                                            {config.pricePrefix}
                                        </span>
                                        <input
                                            type="number"
                                            className={`form-control border-0 bg-light fs-6 fw-bold text-${config.themeColor}`}
                                            placeholder="0.00"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                            min="0"
                                            step="any"
                                        />
                                    </div>
                                </div>

                                <div className="d-grid gap-2 pt-2">
                                    <button
                                        className={`btn btn-${config.themeColor} btn-lg shadow-sm fw-bold rounded-pill py-3 d-flex justify-content-center align-items-center`}
                                        type="submit"
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-lg me-2 fs-5"></i> Save Changes
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

export default Editproducts;