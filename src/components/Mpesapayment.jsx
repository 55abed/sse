import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const MakePayment = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve states passed via navigate()
  const singleproduct = location.state?.singleproduct;
  const preorderProducts = location.state?.preorderProducts || [];
  const isPreorder = location.state?.isPreorder || false;
  const preorderDetails = location.state?.preorderDetails || null;
  const passedTotalCost = location.state?.totalCost;
  
  // Retrieve cyber service state if passed from Cyber page
  const service = location.state?.service;

  // Retrieve cart items if none of the above are passed
  const cartItems = JSON.parse(localStorage.getItem("cart")) || [];

  // Determine items list and total cost automatically
  let displayItems = [];
  let totalAmount = 0;

  if (service) {
    displayItems = [{
      product_name: service.service_name,
      product_cost: service.service_cost,
      product_image: "",
      quantity: 1,
      isService: true
    }];
    totalAmount = Number(service.service_cost);
  } else if (isPreorder && preorderProducts.length > 0) {
    displayItems = preorderProducts;
    totalAmount = passedTotalCost || preorderProducts.reduce((sum, item) => sum + Number(item.product_cost) * (item.quantity || 1), 0);
  } else if (singleproduct) {
    displayItems = [{ ...singleproduct, quantity: 1 }];
    totalAmount = Number(singleproduct.product_cost);
  } else if (cartItems.length > 0) {
    displayItems = cartItems.map((item) => ({
      ...item,
      quantity: item.quantity || 1
    }));
    totalAmount = cartItems.reduce(
      (sum, item) => sum + Number(item.product_cost) * (item.quantity || 1),
      0
    );
  }

  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handlePayment = async (e) => {
    e.preventDefault();

    if (!phone) {
      alert("Please enter your M-Pesa phone number.");
      return;
    }

    if (totalAmount <= 0) {
      alert("No valid items found for payment.");
      return;
    }

    setLoading(true);
    setMessage("Initiating M-Pesa STK Push...");

    try {
      const payload = {
        phone: phone,
        amount: totalAmount,
        isPreorder: isPreorder,
        items: displayItems,
        preorderDetails: preorderDetails
      };

      const response = await axios.post(
        "https://abedhiggs.alwaysdata.net/sseapis/stkpush.php",
        payload
      );

      if (response.data.success) {
        setMessage("STK Push sent successfully! Check your phone to complete payment.");
        
        // Save record locally based on whether it is a pre-order, service, or standard purchase
        if (isPreorder) {
          const existingPreorders = JSON.parse(localStorage.getItem("myPreorders")) || [];
          const newPreorderRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            details: preorderDetails,
            items: displayItems,
            totalAmount: totalAmount,
            status: "Paid / Processing"
          };
          localStorage.setItem("myPreorders", JSON.stringify([newPreorderRecord, ...existingPreorders]));
        } else {
          // Save regular purchase or service history
          const existingOrders = JSON.parse(localStorage.getItem("myOrders")) || [];
          const newOrderRecord = {
            id: Date.now(),
            date: new Date().toISOString(),
            items: displayItems,
            totalAmount: totalAmount,
            status: "Completed / Paid"
          };
          localStorage.setItem("myOrders", JSON.stringify([newOrderRecord, ...existingOrders]));

          // Clear cart if it wasn't a single direct product or service checkout
          if (!singleproduct && !service) {
            localStorage.removeItem("cart");
            window.dispatchEvent(new Event("storage"));
          }
        }

        // Redirect appropriately
        setTimeout(() => {
          navigate(isPreorder ? "/my-preorders" : "/my-orders");
        }, 2500);

      } else {
        setMessage(response.data.message || "Payment initiation failed. Please try again.");
      }
    } catch (err) {
      setMessage("Error initiating payment. Please check backend connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <div className="row g-4 justify-content-center">
          
          {/* LEFT COLUMN: ORDER DETAILS */}
          <div className="col-lg-7">
            <div className="card border-0 shadow-sm rounded-4 p-4 bg-white h-100">
              <div className="d-flex align-items-center mb-4 border-bottom pb-3">
                <i className="bi bi-bag-check-fill text-success fs-3 me-2"></i>
                <h4 className="fw-bold mb-0 text-dark">
                  {service ? "Cyber Service Payment" : isPreorder ? "Pre-Order Details" : "Order Details"}
                </h4>
              </div>

              {displayItems.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-cart-x fs-1 d-block mb-2 text-secondary"></i>
                  <h5>No items found to checkout</h5>
                  <p className="small">Please add items from the shop, cyber services, or pre-order service.</p>
                  <button
                    className="btn btn-outline-success rounded-pill mt-2"
                    onClick={() => navigate("/getproduct")}
                  >
                    Back to Shop
                  </button>
                </div>
              ) : (
                <div className="d-flex flex-column justify-content-between h-100">
                  <div>
                    {/* Pre-Order Customer Summary Badge */}
                    {isPreorder && preorderDetails && (
                      <div className="alert alert-success border-0 rounded-3 mb-4">
                        <h6 className="fw-bold mb-1">Customer &amp; Pickup Information</h6>
                        <small className="d-block"><strong>Name:</strong> {preorderDetails.customerName}</small>
                        <small className="d-block"><strong>Phone:</strong> {preorderDetails.phone}</small>
                        {preorderDetails.notes && (
                          <small className="d-block"><strong>Notes:</strong> {preorderDetails.notes}</small>
                        )}
                      </div>
                    )}

                    {/* Item List with Thumbnail Images */}
                    <div className="list-group list-group-flush mb-4">
                      {displayItems.map((item, index) => {
                        const rawImg = item.product_photo || item.product_image || item.image || item.imageUrl || "";
                        const imageUrl = rawImg.startsWith("http") || rawImg.startsWith("/") 
                          ? rawImg 
                          : `https://abedhiggs.alwaysdata.net/sseapis/productphotos/${rawImg}`;

                        return (
                          <div
                            key={index}
                            className="list-group-item border-bottom py-3 px-0 d-flex justify-content-between align-items-center bg-transparent"
                          >
                            <div className="d-flex align-items-center">
                              {item.isService ? (
                                <div 
                                  className="rounded-3 border bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                                  style={{ width: "60px", height: "60px" }}
                                >
                                  <i className="bi bi-laptop fs-4"></i>
                                </div>
                              ) : rawImg ? (
                                <img
                                  src={imageUrl}
                                  alt={item.product_name || "Product"}
                                  className="rounded-3 border me-3 object-fit-cover"
                                  style={{ width: "60px", height: "60px" }}
                                  onError={(e) => {
                                    e.target.style.display = "none";
                                  }}
                                />
                              ) : (
                                <div 
                                  className="rounded-3 border bg-light d-flex align-items-center justify-content-center me-3 text-muted"
                                  style={{ width: "60px", height: "60px" }}
                                >
                                  <i className="bi bi-image fs-4"></i>
                                </div>
                              )}
                              <div>
                                <h6 className="fw-bold text-dark mb-1">
                                  {item.product_name}
                                </h6>
                                <small className="text-muted">
                                  {item.isService ? "Cyber Service" : `Quantity: ${item.quantity || 1} \u00d7 KSH ${item.product_cost}`}
                                </small>
                              </div>
                            </div>
                            <span className="fw-bold text-success fs-6">
                              KSH {Number(item.product_cost) * (item.quantity || 1)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Total Cost Section */}
                  <div className="p-3 bg-light rounded-3 d-flex align-items-center justify-content-between border mt-auto">
                    <span className="fw-bold text-secondary">Total Amount</span>
                    <span className="h3 fw-bold text-success mb-0">
                      KSH {totalAmount}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: M-PESA STK PUSH CARD */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden">
              <div className="bg-success text-white p-4 text-center">
                <i className="bi bi-phone-vibrate fs-1 mb-2 d-block"></i>
                <h3 className="fw-bold mb-1">Lipa Na M-PESA</h3>
                <p className="mb-0 text-white-50 small">
                  STK Push Instant Payment
                </p>
              </div>

              <div className="card-body p-4 bg-white">
                <form onSubmit={handlePayment}>
                  <div className="mb-3">
                    <label className="form-label fw-bold text-dark">
                      M-Pesa Phone Number
                    </label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0 text-muted">
                        <i className="bi bi-telephone-fill"></i>
                      </span>
                      <input
                        type="tel"
                        className="form-control form-control-lg border-start-0 fs-6"
                        placeholder="2547XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                      />
                    </div>
                    <small className="text-muted mt-1 d-block">
                      Enter format: <strong>2547XXXXXXXX</strong>
                    </small>
                  </div>

                  {message && (
                    <div
                      className={`alert ${
                        message.includes("successfully")
                          ? "alert-success"
                          : "alert-info"
                      } rounded-3 py-2 small mb-3`}
                    >
                      {message}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn btn-success btn-lg w-100 rounded-pill py-3 fw-bold shadow-sm mb-3"
                    disabled={loading || totalAmount === 0}
                  >
                    {loading ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Processing...
                      </span>
                    ) : (
                      `Pay KSH ${totalAmount}`
                    )}
                  </button>

                  {/* Optional shortcut to view pre-orders/orders history */}
                  <button
                    type="button"
                    className="btn btn-outline-secondary btn-sm w-100 rounded-pill"
                    onClick={() => navigate(isPreorder ? "/my-preorders" : "/my-orders")}
                  >
                    <i className="bi bi-eye-fill me-1"></i> {isPreorder ? "View My Pre-Orders History" : "View My Previous Purchases"}
                  </button>
                </form>

                <div className="mt-4 p-3 bg-light rounded-3 border">
                  <h6 className="fw-bold text-dark mb-2 small">
                    <i className="bi bi-info-circle-fill text-primary me-1"></i>
                    Payment Steps:
                  </h6>
                  <ol className="small text-muted mb-0 ps-3" style={{ fontSize: "0.85rem" }}>
                    <li>Click <strong>Pay</strong> to trigger an M-Pesa prompt on your phone.</li>
                    <li>Enter your <strong>M-Pesa PIN</strong> to authorize payment.</li>
                    <li>You will receive an official M-Pesa SMS confirmation.</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default MakePayment;