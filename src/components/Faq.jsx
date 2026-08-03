import React, { useState } from "react";

const Faq = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [openIndex, setOpenIndex] = useState(null);
  
  // ================= AUTOCOMPLETE DROPDOWN STATE =================
  const [showSuggestions, setShowSuggestions] = useState(false);

  const faqData = [
    // PAYMENTS & M-PESA
    {
      id: 1,
      category: "payments",
      question: "What payment options do you support?",
      answer:
        "We support M-Pesa STK Push. When you checkout, an automated payment prompt will be sent directly to your phone to complete your transaction instantly in Kenya Shillings (KSH)."
    },
    {
      id: 2,
      category: "payments",
      question: "How does the M-Pesa STK Push work?",
      answer:
        "Once you confirm your order, a secure M-Pesa prompt pops up on your screen. Just enter your secret M-Pesa PIN, and your payment will be verified immediately with a success confirmation code."
    },

    // SHOP & PICKUP (MUMIAS / EKERO)
    {
      id: 3,
      category: "orders",
      question: "Do you offer deliveries outside?",
      answer:
        "No, we do not offer deliveries. All orders are strictly for physical collection at our business location around the Mumias and Ekero area."
    },
    {
      id: 4,
      category: "orders",
      question: "Where can I collect my kiosk items or cyber services?",
      answer:
        "You can pick up your kiosk items, printouts, or cyber service documentation directly from our shop around Mumias / Ekero during operating hours (Monday – Sunday: 8:00 AM – 8:00 PM)."
    },
    {
      id: 5,
      category: "orders",
      question: "What kind of products do you sell in the shop?",
      answer:
        "We operate a local community kiosk selling everyday small shop convenience goods, alongside fully functional cyber services (such as typing, printing, photocopying, and online government applications)."
    },

    // COURSES & TRAINING
    {
      id: 6,
      category: "courses",
      question: "How do I enroll for Financial or Basic Computer courses?",
      answer:
        "Navigate to our application section or click 'Enroll Now' under your chosen package (like QuickBooks, Tally, Sage, or Microsoft Excel), fill in your registration details, and use the M-Pesa STK push to secure your placement."
    },
    {
      id: 7,
      category: "courses",
      question: "Will I receive a recognized certificate upon course completion?",
      answer:
        "Yes, upon completing your practical training and evaluation in computer applications or professional accounting packages, we award a verified certificate of completion."
    },

    // ACCOUNTS & SUPPORT
    {
      id: 8,
      category: "general",
      question: "Do I need an account to buy or place an order?",
      answer:
        "You can look through our shop items and course listings freely, but you will need to sign in or register an account before checking out with the M-Pesa STK push."
    }
  ];

  // Live autocomplete suggestions derived dynamically based on keyed letters/numbers
  const searchSuggestions = searchQuery.trim()
    ? faqData.filter((item) =>
        (item.question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.answer || "").toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Filter based on search input and category selection
  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory =
      activeCategory === "all" || item.category === activeCategory;
    const matchesSearch =
      (item.question || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.answer || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      {/* Page Header */}
      <div className="container">
        <div className="text-center mb-5">
          <span className="badge bg-success-subtle text-success border border-success-subtle px-3 py-2 rounded-pill fw-semibold mb-2">
            HELP &amp; SUPPORT
          </span>
          <h1 className="fw-bold text-dark display-5">Frequently Asked Questions</h1>
          <p className="text-muted lead mx-auto" style={{ maxWidth: "650px" }}>
            Got questions about our Mumias/Ekero kiosk shop items, M-Pesa STK push payments, cyber services, or professional training courses? We’ve got answers!
          </p>

          {/* Search Bar with Live Autocomplete Dropdown */}
          <div className="row justify-content-center mt-4">
            <div className="col-lg-6 col-md-8 position-relative">
              <div className="input-group shadow-sm bg-white rounded-pill p-2 border">
                <span className="input-group-text bg-transparent border-0 ps-3">
                  <i className="bi bi-search text-success fs-5"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-0 bg-transparent shadow-none"
                  placeholder="Search questions (e.g. M-Pesa, pickup, Mumias, QuickBooks)..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn btn-link text-secondary text-decoration-none pe-3 shadow-none"
                    onClick={() => {
                      setSearchQuery("");
                      setShowSuggestions(false);
                    }}
                  >
                    <i className="bi bi-x-circle-fill"></i>
                  </button>
                )}
              </div>

              {/* LIVE AUTOCOMPLETE SUGGESTIONS DROPDOWN */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div
                  className="position-absolute start-0 end-0 mx-3 mt-2 bg-white shadow-lg rounded-4 overflow-hidden border z-3 text-start"
                  style={{ maxHeight: "280px", overflowY: "auto" }}
                >
                  <div className="list-group list-group-flush">
                    {searchSuggestions.map((item, index) => (
                      <button
                        key={index}
                        type="button"
                        className="list-group-item list-group-item-action py-2 px-3 border-bottom d-flex align-items-center"
                        onClick={() => {
                          setSearchQuery(item.question);
                          setShowSuggestions(false);
                        }}
                      >
                        <i className="bi bi-search me-2 text-muted fs-6"></i>
                        <span className="fw-semibold text-dark text-truncate">
                          {item.question}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Category Pills */}
        <div className="d-flex justify-content-center flex-wrap gap-2 mb-4">
          {[
            { id: "all", label: "All Questions" },
            { id: "payments", label: "M-Pesa STK Push" },
            { id: "orders", label: "Shop, Kiosk & Mumias Pickup" },
            { id: "courses", label: "Training & Courses" },
            { id: "general", label: "General & Accounts" }
          ].map((cat) => (
            <button
              key={cat.id}
              className={`btn rounded-pill px-4 btn-sm fw-semibold ${
                activeCategory === cat.id
                  ? "btn-success shadow-sm"
                  : "btn-white text-secondary border bg-white"
              }`}
              onClick={() => {
                setActiveCategory(cat.id);
                setOpenIndex(null);
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="row justify-content-center">
          <div className="col-lg-8">
            {filteredFaqs.length === 0 ? (
              <div className="card border-0 shadow-sm rounded-4 text-center p-5 bg-white">
                <i className="bi bi-question-circle text-muted fs-1 mb-2"></i>
                <h5 className="fw-bold text-dark">No matching questions found</h5>
                <p className="text-muted small mb-3">
                  Try searching with different keywords or browse all categories.
                </p>
                <button
                  className="btn btn-outline-success rounded-pill btn-sm mx-auto"
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                >
                  Reset Search Filters
                </button>
              </div>
            ) : (
              <div className="d-flex flex-column gap-3">
                {filteredFaqs.map((faq, index) => {
                  const isOpen = openIndex === index;
                  return (
                    <div
                      key={faq.id}
                      className="card border-0 shadow-sm rounded-4 overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        className="card-header bg-white border-0 p-4 text-start d-flex justify-content-between align-items-center w-100 shadow-none"
                        onClick={() => toggleAccordion(index)}
                        style={{ cursor: "pointer" }}
                      >
                        <span className="fw-bold text-dark fs-6 pe-3">
                          <i className="bi bi-patch-question text-success me-2 fs-5 align-middle"></i>
                          {faq.question}
                        </span>
                        <i
                          className={`bi bi-chevron-${
                            isOpen ? "up text-success" : "down text-muted"
                          } fs-5`}
                        ></i>
                      </button>

                      {isOpen && (
                        <div className="card-body pt-0 px-4 pb-4 text-secondary">
                          <hr className="mt-0 mb-3 opacity-10" />
                          <p className="mb-0" style={{ lineHeight: "1.6" }}>
                            {faq.answer}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Contact CTA Footer */}
        <div className="row justify-content-center mt-5">
          <div className="col-lg-8">
            <div className="card border-0 bg-dark text-white rounded-4 shadow-lg p-4 p-md-5 text-center">
              <i className="bi bi-headset fs-1 text-success mb-2"></i>
              <h3 className="fw-bold">Still have questions?</h3>
              <p className="text-white-50 mx-auto" style={{ maxWidth: "500px" }}>
                Our local team around Mumias / Ekero is ready to assist you with store orders, pickup details, cyber services, or course inquiries.
              </p>
              <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
                <a
                  href="tel:0721772737"
                  className="btn btn-success rounded-pill px-4 fw-bold"
                >
                  <i className="bi bi-telephone-fill me-2"></i> Call: 0721 772 737
                </a>
                <a
                  href="https://wa.me/254721772737"
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline-light rounded-pill px-4 fw-bold"
                >
                  <i className="bi bi-whatsapp me-2"></i> WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;