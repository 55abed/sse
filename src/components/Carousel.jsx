import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Carousel = () => {
    // Force Bootstrap carousel to initialize and auto-cycle on mount
    useEffect(() => {
        const carouselElement = document.getElementById("mycarousel");
        if (carouselElement && window.bootstrap) {
            new window.bootstrap.Carousel(carouselElement, {
                interval: 4000,
                ride: "carousel",
                wrap: true
            });
        }
    }, []);

    // Glassmorphism styling for the text overlay box
    const overlayCardStyle = {
        background: "rgba(4, 30, 42, 0.75)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderRadius: "16px",
        border: "1px solid rgba(255, 255, 255, 0.18)",
        maxWidth: "650px",
        boxShadow: "0 15px 35px rgba(0, 0, 0, 0.3)",
        bottom: "10%",
        left: "7%",
        right: "auto"
    };

    return (
        <div className="container-fluid px-0 my-3">
            <div className="carousel-banner-wrapper">
                <div
                    id="mycarousel"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                >
                    {/* Carousel Indicators (0, 1, 2) */}
                    <div className="carousel-indicators">
                        <button
                            type="button"
                            data-bs-target="#mycarousel"
                            data-bs-slide-to="0"
                            className="active"
                            aria-current="true"
                            aria-label="Slide 1"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#mycarousel"
                            data-bs-slide-to="1"
                            aria-label="Slide 2"
                        ></button>
                        <button
                            type="button"
                            data-bs-target="#mycarousel"
                            data-bs-slide-to="2"
                            aria-label="Slide 3"
                        ></button>
                    </div>

                    {/* Carousel Items */}
                    <div className="carousel-inner">
                        
                        {/* SLIDE 1: Financial Applications */}
                        <div className="carousel-item active" data-bs-interval="4000">
                            <img
                                src="images/carousel1.png"
                                alt="Stanley & Edrick's Consultants - Financial Applications"
                                className="carousel-banner-img d-block w-100"
                                style={{ height: "500px", objectFit: "cover" }}
                            />
                            <div 
                                className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start p-4 mb-3 mb-md-4" 
                                style={overlayCardStyle}
                            >
                                <span className="badge bg-success mb-2 px-3 py-2 text-uppercase fw-bold">
                                    Empowering Future
                                </span>
                                <h1 className="display-6 fw-bold text-white mb-2">
                                    Financial Applications
                                </h1>
                                <p className="text-light mb-4 d-none d-sm-block">
                                    Master industry-standard computerized accounting packages and professional financial skills.
                                </p>
                                <div>
                                    <Link to="/home#financial" className="btn btn-success btn-lg px-4 me-2 shadow-sm fw-bold">
                                        Apply for Courses <i className="bi bi-arrow-right ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 2: Cyber & KRA Services */}
                        <div className="carousel-item" data-bs-interval="4000">
                            <img
                                src="images/carousel1.png"
                                alt="Cyber & KRA Services"
                                className="carousel-banner-img d-block w-100"
                                style={{ height: "500px", objectFit: "cover" }}
                            />
                            <div 
                                className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start p-4 mb-3 mb-md-4" 
                                style={overlayCardStyle}
                            >
                                <span className="badge bg-primary mb-2 px-3 py-2 text-uppercase fw-bold">
                                    Fast & Reliable
                                </span>
                                <h1 className="display-6 fw-bold text-white mb-2">
                                    Cyber & KRA Services
                                </h1>
                                <p className="text-light mb-4 d-none d-sm-block">
                                    Seamless KRA PIN registration, tax returns filing, e-Citizen processing, and professional documentation.
                                </p>
                                <div>
                                    <Link to="/cyber" className="btn btn-primary btn-lg px-4 me-2 shadow-sm fw-bold">
                                        Access Cyber Center
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 3: Shop Items & Products */}
                        <div className="carousel-item" data-bs-interval="4000">
                            <img
                                src="images/carousel1.png"
                                alt="Shop Items & Products"
                                className="carousel-banner-img d-block w-100"
                                style={{ height: "500px", objectFit: "cover" }}
                            />
                            <div 
                                className="carousel-caption d-flex flex-column justify-content-center align-items-start text-start p-4 mb-3 mb-md-4" 
                                style={overlayCardStyle}
                            >
                                <span className="badge bg-warning text-dark mb-2 px-3 py-2 text-uppercase fw-bold">
                                    Store Catalog
                                </span>
                                <h1 className="display-6 fw-bold text-white mb-2">
                                    Shop Items & Products
                                </h1>
                                <p className="text-light mb-4 d-none d-sm-block">
                                    Browse our online store for food items, daily essentials, and household commodities with M-Pesa payment.
                                </p>
                                <div>
                                    <Link to="/home#shop" className="btn btn-warning text-dark btn-lg px-4 me-2 shadow-sm fw-bold">
                                        Shop Products <i className="bi bi-cart-fill ms-1"></i>
                                    </Link>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Navigation Controls */}
                    <button
                        className="carousel-control-prev"
                        type="button"
                        data-bs-target="#mycarousel"
                        data-bs-slide="prev"
                    >
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next"
                        type="button"
                        data-bs-target="#mycarousel"
                        data-bs-slide="next"
                    >
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;