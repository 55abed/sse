import React, { useEffect } from "react";
import { Link } from "react-router-dom";

const Carousel = () => {
    // Force Bootstrap carousel to initialize and auto-cycle on mount
    useEffect(() => {
        const carouselElement = document.getElementById("mycarousel");
        if (carouselElement && window.bootstrap) {
            new window.bootstrap.Carousel(carouselElement, {
                interval: 4500,
                ride: "carousel",
                wrap: true
            });
        }
    }, []);

    // Advanced CSS animations & modern design system
    const customStyles = `
        /* Soft Floating Animations */
        @keyframes floatIcon {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(4deg); }
        }
        @keyframes auraPulse {
            0%, 100% { opacity: 0.35; transform: scale(1) rotate(0deg); }
            50% { opacity: 0.65; transform: scale(1.15) rotate(10deg); }
        }
        @keyframes borderGlow {
            0%, 100% { border-color: rgba(255, 255, 255, 0.2); }
            50% { border-color: rgba(255, 255, 255, 0.45); }
        }

        /* Tech Mesh Background Pattern */
        .hero-mesh-bg {
            background-image: 
                radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03) 1px, transparent 0),
                linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 32px 32px, 64px 64px, 64px 64px;
        }

        /* Next-Gen Glass Card Container */
        .hero-glass-ultra {
            background: linear-gradient(135deg, rgba(10, 20, 32, 0.72) 0%, rgba(4, 10, 18, 0.88) 100%);
            backdrop-filter: blur(24px);
            -webkit-backdrop-filter: blur(24px);
            border-radius: 32px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            max-width: 920px;
            width: 92%;
            box-shadow: 
                0 30px 70px -15px rgba(0, 0, 0, 0.85),
                0 0 0 1px rgba(255, 255, 255, 0.08) inset,
                0 20px 40px -20px rgba(0, 0, 0, 0.5);
            animation: borderGlow 6s ease-in-out infinite;
            transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-glass-ultra:hover {
            transform: translateY(-6px) scale(1.005);
            box-shadow: 
                0 40px 80px -12px rgba(0, 0, 0, 0.95),
                0 0 0 1px rgba(255, 255, 255, 0.18) inset,
                0 0 50px -10px rgba(255, 255, 255, 0.12);
        }

        /* Watermark Background Graphic */
        .watermark-hero-icon {
            position: absolute;
            font-size: 20rem;
            opacity: 0.035;
            color: #ffffff;
            pointer-events: none;
            user-select: none;
            animation: floatIcon 12s ease-in-out infinite;
            filter: blur(1px);
        }

        /* Glowing Ambient Lighting */
        .hero-ambient-orb {
            position: absolute;
            width: 500px;
            height: 500px;
            border-radius: 50%;
            filter: blur(110px);
            animation: auraPulse 9s ease-in-out infinite;
            pointer-events: none;
        }

        /* High-End Button Micro-Interactions */
        .btn-ultra {
            transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            position: relative;
            z-index: 2;
            overflow: hidden;
            border-radius: 14px;
        }
        .btn-ultra:hover {
            transform: translateY(-3px) scale(1.02);
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.45) !important;
        }
        .btn-ultra i {
            transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .btn-ultra:hover i {
            transform: translateX(6px);
        }

        /* Custom Indicator Bar System */
        #mycarousel .carousel-indicators {
            bottom: 20px;
        }
        #mycarousel .carousel-indicators [data-bs-target] {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            margin: 0 6px;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            background-color: rgba(255, 255, 255, 0.4);
            border: 2px solid transparent;
        }
        #mycarousel .carousel-indicators .active {
            width: 36px;
            border-radius: 20px;
            background-color: #ffffff;
            box-shadow: 0 0 12px rgba(255, 255, 255, 0.8);
        }

        /* Glassmorphic Arrow Controls */
        .carousel-control-btn {
            width: 52px;
            height: 52px;
            background: rgba(15, 23, 42, 0.5);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
        }
        .carousel-control-prev:hover .carousel-control-btn,
        .carousel-control-next:hover .carousel-control-btn {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: scale(1.1);
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);
        }

        /* Typography polish */
        .heading-gradient {
            background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.85) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    `;

    return (
        <div className="container-fluid px-0 my-3">
            <style>{customStyles}</style>

            <div className="carousel-banner-wrapper">
                <div
                    id="mycarousel"
                    className="carousel slide carousel-fade"
                    data-bs-ride="carousel"
                >
                    {/* Futuristic Pill Indicators */}
                    <div className="carousel-indicators z-2">
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
                    <div className="carousel-inner rounded-5 overflow-hidden shadow-2xl">
                        
                        {/* SLIDE 1: Financial Applications */}
                        <div className="carousel-item active" data-bs-interval="4500">
                            <div 
                                className="d-flex align-items-center justify-content-center px-3 py-5 position-relative overflow-hidden hero-mesh-bg"
                                style={{
                                    minHeight: "600px",
                                    background: "radial-gradient(circle at 80% 20%, #063221 0%, #020c08 100%)"
                                }}
                            >
                                {/* Background Ambient Visuals */}
                                <div 
                                    className="hero-ambient-orb" 
                                    style={{ background: "#10b981", top: "-20%", right: "0%" }} 
                                />
                                <i className="bi bi-graph-up-arrow watermark-hero-icon" style={{ right: "3%", bottom: "-5%" }}></i>

                                <div className="hero-glass-ultra p-4 p-sm-5 text-center text-md-start d-flex flex-column align-items-center align-items-md-start position-relative z-1">
                                    <span className="badge bg-success bg-gradient mb-3 px-3 py-2 text-uppercase fw-bold fs-6 shadow-sm border border-success border-opacity-50">
                                        Empowering Future
                                    </span>
                                    <h1 className="display-3 fw-extrabold mb-3 heading-gradient">
                                        Financial Applications
                                    </h1>
                                    <p className="lead text-light opacity-90 mb-4 fs-5 max-w-700">
                                        Master industry-standard computerized accounting packages and professional financial skills.
                                    </p>
                                    <div>
                                        <Link 
                                            to="/home#financial" 
                                            className="btn btn-success btn-ultra btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center"
                                        >
                                            Apply for Courses <i className="bi bi-arrow-right ms-2 fs-5"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 2: Cyber & KRA Services */}
                        <div className="carousel-item" data-bs-interval="4500">
                            <div 
                                className="d-flex align-items-center justify-content-center px-3 py-5 position-relative overflow-hidden hero-mesh-bg"
                                style={{
                                    minHeight: "600px",
                                    background: "radial-gradient(circle at 20% 80%, #034078 0%, #010b14 100%)"
                                }}
                            >
                                {/* Background Ambient Visuals */}
                                <div 
                                    className="hero-ambient-orb" 
                                    style={{ background: "#0077b6", bottom: "-20%", left: "0%" }} 
                                />
                                <i className="bi bi-shield-check watermark-hero-icon" style={{ left: "2%", top: "-5%" }}></i>

                                <div className="hero-glass-ultra p-4 p-sm-5 text-center text-md-start d-flex flex-column align-items-center align-items-md-start position-relative z-1">
                                    <span className="badge bg-primary bg-gradient mb-3 px-3 py-2 text-uppercase fw-bold fs-6 shadow-sm border border-primary border-opacity-50">
                                        Fast & Reliable
                                    </span>
                                    <h1 className="display-3 fw-extrabold mb-3 heading-gradient">
                                        Cyber & KRA Services
                                    </h1>
                                    <p className="lead text-light opacity-90 mb-4 fs-5 max-w-700">
                                        Seamless KRA PIN registration, tax returns filing, e-Citizen processing, and professional documentation.
                                    </p>
                                    <div>
                                        <Link 
                                            to="/cyber" 
                                            className="btn btn-primary btn-ultra btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center"
                                        >
                                            Access Cyber Center
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* SLIDE 3: Shop Items & Products */}
                        <div className="carousel-item" data-bs-interval="4500">
                            <div 
                                className="d-flex align-items-center justify-content-center px-3 py-5 position-relative overflow-hidden hero-mesh-bg"
                                style={{
                                    minHeight: "600px",
                                    background: "radial-gradient(circle at 80% 80%, #4a2800 0%, #0f0700 100%)"
                                }}
                            >
                                {/* Background Ambient Visuals */}
                                <div 
                                    className="hero-ambient-orb" 
                                    style={{ background: "#d97706", bottom: "-20%", right: "5%" }} 
                                />
                                <i className="bi bi-cart-check watermark-hero-icon" style={{ right: "5%", top: "0%" }}></i>

                                <div className="hero-glass-ultra p-4 p-sm-5 text-center text-md-start d-flex flex-column align-items-center align-items-md-start position-relative z-1">
                                    <span className="badge bg-warning text-dark mb-3 px-3 py-2 text-uppercase fw-bold fs-6 shadow-sm border border-warning border-opacity-50">
                                        Store Catalog
                                    </span>
                                    <h1 className="display-3 fw-extrabold mb-3 heading-gradient">
                                        Shop Items & Products
                                    </h1>
                                    <p className="lead text-light opacity-90 mb-4 fs-5 max-w-700">
                                        Browse our online store for food items, daily essentials, and household commodities with M-Pesa payment.
                                    </p>
                                    <div>
                                        <Link 
                                            to="/home#shop" 
                                            className="btn btn-warning text-dark btn-ultra btn-lg px-5 py-3 shadow-lg fw-bold d-inline-flex align-items-center"
                                        >
                                            Shop Products <i className="bi bi-cart-fill ms-2 fs-5"></i>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* Next-Gen Circular Controls */}
                    <button
                        className="carousel-control-prev border-0 bg-transparent ms-2 ms-md-4"
                        type="button"
                        data-bs-target="#mycarousel"
                        data-bs-slide="prev"
                    >
                        <div className="carousel-control-btn">
                            <i className="bi bi-chevron-left text-white fs-4"></i>
                        </div>
                        <span className="visually-hidden">Previous</span>
                    </button>
                    <button
                        className="carousel-control-next border-0 bg-transparent me-2 me-md-4"
                        type="button"
                        data-bs-target="#mycarousel"
                        data-bs-slide="next"
                    >
                        <div className="carousel-control-btn">
                            <i className="bi bi-chevron-right text-white fs-4"></i>
                        </div>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Carousel;