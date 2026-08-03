import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Carousel from "./Carousel";

const Getproducts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user"));

  const [visibleCount, setVisibleCount] = useState(8);
  const [loading, setLoading] = useState("");
  const [error, setError] = useState("");
  const [Products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  // ================= AUTOCOMPLETE SEARCH STATE =================
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ================= PRE-ORDER MULTI-ITEM STATE =================
  const [selectedPreorderProducts, setSelectedPreorderProducts] = useState([]);
  const [preorderName, setPreorderName] = useState("");
  const [preorderPhone, setPreorderPhone] = useState("");
  const [preorderNotes, setPreorderNotes] = useState("");

  // ================= SCROLL TO HASH SECTION =================
  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace("#", "");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location]);

  // Real-time dynamic search filter for shop products
  const filtered_products = Products.filter(
    (item) =>
      item.product_name
        ?.toLowerCase()
        .includes(search.toLowerCase()) ||
      item.product_description
        ?.toLowerCase()
        .includes(search.toLowerCase())
  );

  // ================= LIVE AUTOCOMPLETE SUGGESTIONS =================
  const searchableCatalog = [
    ...Products.map((p) => ({
      name: p.product_name,
      category: "Store Product",
      section: "shop"
    })),
    { name: "QuickBooks", category: "Financial Application", section: "financial" },
    { name: "Tally", category: "Financial Application", section: "financial" },
    { name: "Sun Microsystems", category: "Financial Application", section: "financial" },
    { name: "Sage", category: "Financial Application", section: "financial" },
    { name: "Introduction to Computers", category: "Basic Application", section: "basic" },
    { name: "Operating System", category: "Basic Application", section: "basic" },
    { name: "Word Processor", category: "Basic Application", section: "basic" },
    { name: "Spreadsheet", category: "Basic Application", section: "basic" },
    { name: "Publications", category: "Basic Application", section: "basic" },
    { name: "Database", category: "Basic Application", section: "basic" },
    { name: "Presentation Software", category: "Basic Application", section: "basic" },
    { name: "Basic Computer Installation", category: "Basic Application", section: "basic" }
  ];

  const searchSuggestions = search.trim()
    ? searchableCatalog.filter((item) =>
        item.name.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const getproducts = async () => {
    setLoading("Please wait...");
    try {
      const response = await axios.get(
        "https://abedhiggs.alwaysdata.net/sseapis/getproducts.php"
      );
      setProducts(response.data);
      setLoading("");
    } catch (err) {
      setLoading("");
      setError(err.message);
    }
  };

  const handleAddToCart = (product) => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const alreadyInCart = existingCart.some(
      (item) => item.product_id === product.product_id
    );

    if (alreadyInCart) {
      alert(product.product_name + " is already in your cart!");
      return;
    }

    existingCart.push(product);

    localStorage.setItem("cart", JSON.stringify(existingCart));
    window.dispatchEvent(new Event("storage"));
    alert(product.product_name + " added to cart!");
  };

  const handlePurchase = (product) => {
    if (!user) {
      alert("Please sign in first before purchasing.");
      navigate("/signin");
      return;
    }

    navigate("/makepayment", {
      state: {
        singleproduct: product
      }
    });
  };

  // Select shop item for Pre-Order
  const handleSelectPreorder = (product) => {
    setSelectedPreorderProducts((prev) => {
      const exists = prev.find((item) => item.product_id === product.product_id);
      if (exists) {
        return prev.map((item) =>
          item.product_id === product.product_id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    const preorderSection = document.getElementById("preorder");
    if (preorderSection) {
      preorderSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Modify pre-order item quantity
  const handleQuantityChange = (productId, delta) => {
    setSelectedPreorderProducts((prev) =>
      prev
        .map((item) => {
          if (item.product_id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Remove pre-order item entirely
  const handleRemovePreorderItem = (productId) => {
    setSelectedPreorderProducts((prev) =>
      prev.filter((item) => item.product_id !== productId)
    );
  };

  // Calculate pre-order total cost
  const calculatePreorderTotal = () => {
    return selectedPreorderProducts.reduce(
      (sum, item) => sum + Number(item.product_cost) * item.quantity,
      0
    );
  };

  // Submit Pre-Order
  const handlePreorderSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please sign in first to complete your pre-order reservation.");
      navigate("/signin");
      return;
    }

    if (selectedPreorderProducts.length === 0) {
      alert("Please select at least one product from the shop list to pre-order.");
      return;
    }

    const totalCost = calculatePreorderTotal();

    navigate("/makepayment", {
      state: {
        preorderProducts: selectedPreorderProducts,
        totalCost: totalCost,
        isPreorder: true,
        preorderDetails: {
          customerName: preorderName,
          phone: preorderPhone,
          notes: preorderNotes,
          itemTitles: selectedPreorderProducts
            .map((item) => `${item.product_name} (x${item.quantity})`)
            .join(", ")
        }
      }
    });
  };

  // Admin action: Toggle Out of Stock Status
  const toggleStockStatus = async (product) => {
    const newStatus =
      product.is_out_of_stock === 1 || product.is_out_of_stock === "1" ? 0 : 1;

    setProducts((prev) =>
      prev.map((item) =>
        item.product_id === product.product_id
          ? { ...item, is_out_of_stock: newStatus }
          : item
      )
    );

    const formdata = new FormData();
    formdata.append("product_id", product.product_id);
    formdata.append("is_out_of_stock", newStatus);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/togglestock.php",
        formdata
      );
      if (!response.data.success) {
        alert("Server Error: " + response.data.message);
        getproducts();
      }
    } catch (err) {
      console.error(err);
      alert("Unable to connect to server. Check if togglestock.php exists in C:\\xampp\\htdocs\\sseapis\\");
      getproducts();
    }
  };
  const deleteProduct = async (product_id) => {
    if (!window.confirm("Delete this product?")) return;

    const formdata = new FormData();
    formdata.append("product_id", product_id);

    try {
      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/deleteproduct.php",
        formdata
      );

      alert(response.data.message);
      getproducts();
    } catch {
      alert("Unable to delete product.");
    }
  };

  const editProduct = (product) => {
    navigate("/editproduct", {
      state: { product }
    });
  };

  useEffect(() => {
    getproducts();
  }, []);

  const imagepath = "https://abedhiggs.alwaysdata.net/sseapis/productphotos/";

  return (
    <div className="bg-light pb-5">
      {/* Custom Styling */}
      <style>{`
        .hover-lift {
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .hover-lift:hover {
          transform: translateY(-6px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12) !important;
        }
        .img-zoom-container {
          overflow: hidden;
          background-color: #f8f9fa;
        }
        .img-zoom {
          transition: transform 0.35s ease;
        }
        .hover-lift:hover .img-zoom {
          transform: scale(1.06);
        }
        .section-title {
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .section-badge {
          display: inline-block;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-size: 0.75rem;
          padding: 6px 16px;
          border-radius: 50px;
        }
        .icon-box {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
        }
        .suggestion-item:hover {
          background-color: #f1f5f9;
        }
      `}</style>

      {/* Carousel Wrapper */}
      <div className="shadow-sm">
        <Carousel />
      </div>

      <div className="container py-4">
        {/* HERO / OFFERING HEADER */}
        <div className="text-center my-5">
          <span className="section-badge bg-success-subtle text-success border border-success-subtle mb-2">
            Explore Opportunities
          </span>
          <h1 className="section-title text-dark display-5 fw-bold mb-2">
            WHAT WE OFFER
          </h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: "600px" }}>
            Discover our comprehensive financial packages, software programs, cyber services and shop products.
          </p>

          {/* SEARCH BAR WITH LIVE AUTOCOMPLETE DROPDOWN */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-7 col-md-9 position-relative">
              <div
                className="input-group shadow-sm bg-white p-2"
                style={{ borderRadius: "50px", border: "1px solid #e2e8f0" }}
              >
                <span className="input-group-text bg-transparent border-0 ps-3">
                  <i className="bi bi-search text-success fs-5"></i>
                </span>
                <input
                  type="search"
                  className="form-control border-0 bg-transparent shadow-none"
                  placeholder="Search courses, products or services..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  style={{ fontSize: "16px" }}
                />

                {/* Clear search query button */}
                {search && (
                  <button
                    type="button"
                    className="btn border-0 bg-transparent text-muted pe-2"
                    onClick={() => {
                      setSearch("");
                      setShowSuggestions(false);
                    }}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}

                <button
                  className="btn btn-success rounded-pill px-4 fw-semibold"
                  type="button"
                  onClick={() => {
                    setShowSuggestions(false);
                    const shopEl = document.getElementById("shop");
                    if (shopEl) shopEl.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Search
                </button>
              </div>

              {/* LIVE AUTOCOMPLETE SUGGESTIONS DROPDOWN */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div
                  className="position-absolute start-0 end-0 mx-3 mt-2 bg-white shadow-lg rounded-4 overflow-hidden border z-3"
                  style={{ maxHeight: "280px", overflowY: "auto" }}
                >
                  <div className="list-group list-group-flush text-start">
                    {searchSuggestions.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="list-group-item list-group-item-action suggestion-item d-flex justify-content-between align-items-center py-2 px-3 border-bottom"
                        onClick={() => {
                          setSearch(item.name);
                          setShowSuggestions(false);
                          const targetSection = document.getElementById(item.section);
                          if (targetSection) {
                            targetSection.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                      >
                        <div className="d-flex align-items-center me-2 text-truncate">
                          <i className="bi bi-search me-2 text-muted fs-6"></i>
                          <span className="fw-semibold text-dark text-truncate">
                            {item.name}
                          </span>
                        </div>
                        <span className="badge bg-light text-success border rounded-pill">
                          {item.category}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ================= FINANCIAL APPLICATIONS ================= */}
        <section id="financial" className="py-4">
          <div className="d-flex align-items-center mb-4">
            <div className="icon-box bg-success text-white me-3 shadow-sm">
              <i className="bi bi-cash-coin"></i>
            </div>
            <div>
              <h2 className="section-title mb-0 h3 text-dark">Financial Applications</h2>
              <small className="text-muted">Master industry-standard computerized accounting packages</small>
            </div>
          </div>

          <div className="row g-4">
            {[
              { name: "QuickBooks", desc: "Learn computerized accounting using QuickBooks." },
              { name: "Tally", desc: "Master accounting and inventory management using Tally." },
              { name: "Sun Microsystems", desc: "Learn enterprise computing technologies." },
              { name: "Sage", desc: "Professional accounting and payroll using Sage." }
            ].map((course, idx) => (
              <div className="col-lg-3 col-md-6" key={idx}>
                <div className="card border-0 shadow-sm rounded-4 h-100 hover-lift p-3">
                  <div className="card-body d-flex flex-column text-center">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "60px", height: "60px" }}>
                      <i className="bi bi-calculator text-success fs-3"></i>
                    </div>
                    <h5 className="fw-bold text-dark">{course.name}</h5>
                    <p className="text-muted small flex-grow-1">{course.desc}</p>
                    <button
                      className="btn btn-outline-success rounded-pill w-100 fw-semibold mt-3"
                      onClick={() => navigate(`/application?course=${encodeURIComponent(course.name)}`)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-5 text-secondary opacity-25" />

        {/* ================= BASIC COMPUTER APPLICATIONS ================= */}
        <section id="basic" className="py-4">
          <div className="d-flex align-items-center mb-4">
            <div className="icon-box bg-primary text-white me-3 shadow-sm">
              <i className="bi bi-laptop"></i>
            </div>
            <div>
              <h2 className="section-title mb-0 h3 text-dark">Basic Computer Applications</h2>
              <small className="text-muted">Build a solid foundation in computer technology and software</small>
            </div>
          </div>

          <div className="row g-4">
            {[
              { name: "Introduction to Computers", desc: "Learn the fundamentals of computers and information technology." },
              { name: "Operating System", desc: "Learn Windows installation and operating system management." },
              { name: "Word Processor", desc: "Create professional documents using Microsoft Word." },
              { name: "Spreadsheet", desc: "Master Microsoft Excel for calculations and analysis." },
              { name: "Publications", desc: "Learn desktop publishing and professional document design." },
              { name: "Database", desc: "Learn Microsoft Access and database management." },
              { name: "Presentation Software", desc: "Design professional presentations using Microsoft PowerPoint." },
              { name: "Basic Computer Installation", desc: "Learn computer assembly, software installation and maintenance." }
            ].map((course, idx) => (
              <div className="col-lg-3 col-md-6" key={idx}>
                <div className="card border-0 shadow-sm rounded-4 h-100 hover-lift p-3">
                  <div className="card-body d-flex flex-column text-center">
                    <div className="bg-light rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={{ width: "50px", height: "50px" }}>
                      <i className="bi bi-file-earmark-code text-primary fs-4"></i>
                    </div>
                    <h5 className="fw-bold text-dark h6">{course.name}</h5>
                    <p className="text-muted small flex-grow-1">{course.desc}</p>
                    <button
                      className="btn btn-primary bg-gradient rounded-pill w-100 fw-semibold border-0 mt-3"
                      onClick={() => navigate(`/application?course=${encodeURIComponent(course.name)}`)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-5 text-secondary opacity-25" />

        {/* ================= CAREER OPPORTUNITIES ================= */}
        <section id="career" className="py-4">
          <div className="d-flex align-items-center mb-4">
            <div className="icon-box bg-warning text-dark me-3 shadow-sm">
              <i className="bi bi-briefcase-fill"></i>
            </div>
            <div>
              <h2 className="section-title mb-0 h3 text-dark">Career Opportunities</h2>
              <small className="text-muted">Empowering paths you can follow after completing our training</small>
            </div>
          </div>

          <div className="row g-4">
            {[
              { name: "Accountant", desc: "Work in public or private organizations managing financial records.", icon: "bi-graph-up-arrow" },
              { name: "Accounts Assistant", desc: "Support accounting departments with daily financial operations.", icon: "bi-person-badge" },
              { name: "Payroll Officer", desc: "Manage employee salaries, deductions and payroll systems.", icon: "bi-wallet2" },
              { name: "Finance Officer", desc: "Handle budgeting, reporting and financial planning.", icon: "bi-pie-chart-fill" }
            ].map((career, idx) => (
              <div className="col-lg-3 col-md-6" key={idx}>
                <div className="card border-0 shadow-sm rounded-4 h-100 hover-lift p-3 bg-white">
                  <div className="card-body text-center">
                    <i className={`bi ${career.icon} text-warning fs-1 mb-2 d-block`}></i>
                    <h5 className="fw-bold text-dark">{career.name}</h5>
                    <p className="text-muted small mb-0">{career.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="my-5 text-secondary opacity-25" />

        {/* ================= SHOP ITEMS ================= */}
        <section id="shop" className="py-4">
          <div className="d-flex justify-content-between align-items-end mb-4">
            <div>
              <span className="section-badge bg-danger-subtle text-danger mb-1">
                Store Catalog
              </span>
              <h2 className="section-title mb-0 h3 text-dark">Shop Items &amp; Products</h2>
            </div>
          </div>

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-success mb-2" role="status"></div>
              <h5 className="text-secondary fw-normal">{loading}</h5>
            </div>
          )}

          {error && <h5 className="text-center text-danger py-4">{error}</h5>}

          <div className="row g-4">
            {filtered_products
              .slice(0, visibleCount)
              .map((singleproduct) => {
                const isOutOfStock =
                  singleproduct.is_out_of_stock === 1 ||
                  singleproduct.is_out_of_stock === "1";

                return (
                  <div
                    className="col-lg-3 col-md-4 col-sm-6"
                    key={singleproduct.product_id}
                  >
                    <div className="card border-0 shadow-sm rounded-4 h-100 hover-lift overflow-hidden position-relative bg-white">
                      {/* Out of Stock Badge */}
                      {isOutOfStock && (
                        <span className="badge bg-danger position-absolute top-0 end-0 m-3 px-3 py-2 rounded-pill shadow-sm z-1">
                          Out of Stock
                        </span>
                      )}

                      <div className="img-zoom-container position-relative">
                        <img
                          src={imagepath + singleproduct.product_photo}
                          alt={singleproduct.product_name}
                          className="img-zoom w-100"
                          style={{
                            height: "220px",
                            objectFit: "contain",
                            padding: "16px",
                            opacity: isOutOfStock ? 0.5 : 1
                          }}
                        />
                      </div>

                      <div className="card-body d-flex flex-column p-4">
                        <h5 className="fw-bold text-dark h6 text-truncate mb-1">
                          {singleproduct.product_name}
                        </h5>

                        <p className="text-muted small flex-grow-1 line-clamp-2" style={{ fontSize: "0.85rem" }}>
                          {singleproduct.product_description}
                        </p>

                        <div className="d-flex align-items-center justify-content-between mb-3">
                          <span className="text-muted small fw-semibold">Price</span>
                          <span className="h5 fw-bold text-success mb-0">
                            KSH {singleproduct.product_cost}
                          </span>
                        </div>

                        {/* Admin View vs User View */}
                        {user && user.role === "admin" ? (
                          <div className="d-flex flex-column gap-2">
                            <button
                              className={`btn ${
                                isOutOfStock ? "btn-outline-success" : "btn-outline-danger"
                              } btn-sm rounded-pill w-100 fw-semibold`}
                              onClick={() => toggleStockStatus(singleproduct)}
                            >
                              <i className="bi bi-box-seam me-1"></i>
                              {isOutOfStock ? "Mark In Stock" : "Mark Out of Stock"}
                            </button>

                            <button
                              className="btn btn-warning btn-sm rounded-pill w-100 fw-semibold"
                              onClick={() => editProduct(singleproduct)}
                            >
                              <i className="bi bi-pencil me-1"></i> Edit Product
                            </button>

                            <button
                              className="btn btn-danger btn-sm rounded-pill w-100 fw-semibold"
                              onClick={() =>
                                deleteProduct(singleproduct.product_id)
                              }
                            >
                              <i className="bi bi-trash me-1"></i> Delete Product
                            </button>
                          </div>
                        ) : (
                          <div className="d-flex flex-column gap-2">
                            {isOutOfStock ? (
                              <button
                                className="btn btn-secondary rounded-pill w-100 fw-semibold"
                                disabled
                              >
                                Currently Unavailable
                              </button>
                            ) : (
                              <>
                                <button
                                  className="btn btn-success rounded-pill w-100 fw-semibold shadow-sm"
                                  onClick={() => handlePurchase(singleproduct)}
                                >
                                  Purchase Now
                                </button>

                                <button
                                  className="btn btn-outline-success rounded-pill w-100 fw-semibold"
                                  onClick={() => handleAddToCart(singleproduct)}
                                >
                                  <i className="bi bi-cart-plus me-1"></i> Add To Cart
                                </button>

                                <button
                                  className="btn btn-light text-success rounded-pill w-100 fw-semibold border"
                                  onClick={() => handleSelectPreorder(singleproduct)}
                                >
                                  <i className="bi bi-bookmark-plus me-1"></i> Pre-Order Item
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="text-center mt-5">
            {visibleCount < filtered_products.length && (
              <button
                className="btn btn-outline-primary rounded-pill px-5 py-2 fw-bold shadow-sm"
                onClick={() => setVisibleCount(visibleCount + 8)}
              >
                Load More Products
              </button>
            )}
          </div>
        </section>

        {/* ================= PRE-ORDER SERVICE (MULTI-ITEM) ================= */}
        <section id="preorder" className="py-5">
          <div className="row justify-content-center">
            <div className="col-lg-9">
              <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
                <div className="bg-success bg-gradient p-4 text-white text-center">
                  <i className="bi bi-box-seam fs-1 d-block mb-1"></i>
                  <h2 className="fw-bold mb-1">Pre-Order Service</h2>
                  <p className="mb-0 text-white-50 small">
                    Reserve multiple items ahead of time. Pre-orders are finalized upon payment completion.
                  </p>
                </div>

                <div className="card-body p-4 p-md-5 bg-white">
                  <form onSubmit={handlePreorderSubmit}>
                    <div className="row g-4">
                      
                      {/* Step 1: Multi-item selector dropdown */}
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark">
                          1. Add Items to Pre-Order
                        </label>
                        <select
                          className="form-select form-select-lg rounded-3 fs-6"
                          value=""
                          onChange={(e) => {
                            const selected = Products.find(
                              (p) => String(p.product_id) === e.target.value
                            );
                            if (selected) {
                              handleSelectPreorder(selected);
                            }
                          }}
                        >
                          <option value="">-- Choose Items from Shop to Add --</option>
                          {Products.filter(
                            (p) =>
                              p.is_out_of_stock !== 1 && p.is_out_of_stock !== "1"
                          ).map((prod) => (
                            <option key={prod.product_id} value={prod.product_id}>
                              {prod.product_name} - KSH {prod.product_cost}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Selected Items List Card Container */}
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark d-flex justify-content-between align-items-center">
                          <span>Selected Pre-Order Items ({selectedPreorderProducts.length})</span>
                          {selectedPreorderProducts.length > 0 && (
                            <button
                              type="button"
                              className="btn btn-link text-danger text-decoration-none p-0 btn-sm"
                              onClick={() => setSelectedPreorderProducts([])}
                            >
                              Clear All
                            </button>
                          )}
                        </label>

                        {selectedPreorderProducts.length === 0 ? (
                          <div className="text-center p-4 border border-dashed rounded-3 bg-light text-muted">
                            <i className="bi bi-basket fs-3 d-block mb-1"></i>
                            No items added to pre-order yet. Select from dropdown or click <strong>Pre-Order Item</strong> in the shop above.
                          </div>
                        ) : (
                          <div className="list-group rounded-3 shadow-sm border">
                            {selectedPreorderProducts.map((item) => (
                              <div
                                key={item.product_id}
                                className="list-group-item d-flex align-items-center justify-content-between p-3"
                              >
                                <div className="me-3">
                                  <h6 className="mb-0 fw-bold text-dark">
                                    {item.product_name}
                                  </h6>
                                  <small className="text-muted">
                                    KSH {item.product_cost} each
                                  </small>
                                </div>

                                <div className="d-flex align-items-center gap-3">
                                  {/* Quantity selector */}
                                  <div className="input-group input-group-sm" style={{ width: "110px" }}>
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={() => handleQuantityChange(item.product_id, -1)}
                                    >
                                      -
                                    </button>
                                    <span className="form-control text-center bg-white fw-bold">
                                      {item.quantity}
                                    </span>
                                    <button
                                      type="button"
                                      className="btn btn-outline-secondary"
                                      onClick={() => handleQuantityChange(item.product_id, 1)}
                                    >
                                      +
                                    </button>
                                  </div>

                                  <span className="fw-bold text-success" style={{ minWidth: "90px", textAlign: "right" }}>
                                    KSH {Number(item.product_cost) * item.quantity}
                                  </span>

                                  <button
                                    type="button"
                                    className="btn btn-outline-danger btn-sm border-0"
                                    onClick={() => handleRemovePreorderItem(item.product_id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Step 2: Customer Name */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">
                          2. Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="e.g. Edrick Aseri"
                          value={preorderName}
                          onChange={(e) => setPreorderName(e.target.value)}
                          required
                        />
                      </div>

                      {/* Step 3: Customer Phone */}
                      <div className="col-md-6">
                        <label className="form-label fw-bold text-dark">
                          3. Phone Number
                        </label>
                        <input
                          type="tel"
                          className="form-control form-control-lg rounded-3 fs-6"
                          placeholder="e.g. 0712 345 678"
                          value={preorderPhone}
                          onChange={(e) => setPreorderPhone(e.target.value)}
                          required
                        />
                      </div>

                      {/* Calculated Total Display */}
                      <div className="col-12">
                        <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between border">
                          <span className="fw-semibold text-secondary">
                            Calculated Total ({selectedPreorderProducts.reduce((sum, i) => sum + i.quantity, 0)} items):
                          </span>
                          <span className="h4 fw-bold text-success mb-0">
                            KSH {calculatePreorderTotal()}
                          </span>
                        </div>
                      </div>

                      {/* Step 4: Notes */}
                      <div className="col-12">
                        <label className="form-label fw-bold text-dark">
                          4. Reservation / Pickup Notes
                        </label>
                        <textarea
                          rows="3"
                          className="form-control rounded-3"
                          placeholder="Specify preferred pickup date, specifications, or instructions..."
                          value={preorderNotes}
                          onChange={(e) => setPreorderNotes(e.target.value)}
                          required
                        ></textarea>
                      </div>
                      {/* Submit & Redirect Button */}
                      <div className="col-12">
                        <button
                          type="submit"
                          className="btn btn-success btn-lg w-100 rounded-pill py-3 fw-bold shadow"
                          disabled={selectedPreorderProducts.length === 0}
                        >
                          <i className="bi bi-credit-card-fill me-2"></i>
                          Proceed to Payment &amp; Reserve Items
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>{/* ================= CONTACT US ================= */}
        <section id="contact" className="py-5">
          <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
            <div className="card-header text-center text-white py-4 bg-dark">
              <h2 className="mb-1 fw-bold">Get In Touch</h2>
              <p className="text-white-50 mb-0 small">Have questions? Reach out to us anytime.</p>
            </div>
            <div className="card-body p-4 p-md-5 bg-white">
              <div className="row g-4 text-center">
                {/* Physical Location */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-success text-white mx-auto mb-3">
                      <i className="bi bi-geo-alt-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Physical Location</h5>
                    <p className="text-muted small mb-0">
                      Stanley &amp; Edricks Consultants Stall,Ekero,Mission Hospital Road,Mumias.
                    </p>
                  </div>
                </div>

                {/* Postal Address */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-secondary text-white mx-auto mb-3">
                      <i className="bi bi-mailbox"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Postal Address</h5>
                    <p className="text-muted small mb-0">
                      P.O. Box , Mumias, Kenya
                    </p>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-primary text-white mx-auto mb-3">
                      <i className="bi bi-telephone-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Phone Number</h5>
                    <p className="text-muted small mb-0">0721 772 737</p>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="col-md-3">
                  <div className="p-4 rounded-4 bg-light h-100 hover-lift">
                    <div className="icon-box bg-warning text-white mx-auto mb-3">
                      <i className="bi bi-clock-fill"></i>
                    </div>
                    <h5 className="fw-bold text-dark">Business Hours</h5>
                    <p className="text-muted small mb-0">
                      Mon - Sun: 9:00 AM - 7:00 PM
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-5 pt-3 border-top">
                <h5 className="text-success fw-bold">Stanley &amp; Edricks Consultants</h5>
                <p className="text-muted mb-0 small">
                  Email us at <span className="fw-semibold text-dark">sse@gmail.com</span> for prompt assistance.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Getproducts;