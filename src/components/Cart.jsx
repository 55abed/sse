import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const imagepath = "https://abedhiggs.alwaysdata.net/sseapis/productphotos/";

  const loadCart = () => {
    const items = JSON.parse(localStorage.getItem("cart")) || [];
    setCartItems(items);
  };

  useEffect(() => {
    loadCart();
    window.addEventListener("storage", loadCart);
    return () => {
      window.removeEventListener("storage", loadCart);
    };
  }, []);

  const removeItem = (index) => {
    const updatedCart = cartItems.filter((_, i) => i !== index);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);
    window.dispatchEvent(new Event("storage"));
  };

  const clearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      localStorage.removeItem("cart");
      setCartItems([]);
      window.dispatchEvent(new Event("storage"));
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => {
      const price =
        typeof item.product_cost === "string"
          ? Number(item.product_cost.replace(/[^0-9.-]+/g, ""))
          : Number(item.product_cost);
      const qty = item.quantity || 1;
      return acc + (isNaN(price) ? 0 : price * qty);
    }, 0);
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      alert("Please sign in or create an account to complete your order.");
      navigate("/signin");
      return;
    }
    navigate("/makepayment", {
      state: {
        cartItems: cartItems,
        total: calculateTotal(),
      },
    });
  };

  return (
    <div className="container py-4" style={{ maxWidth: "1000px" }}>
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div>
          <h3 className="fw-bold text-dark mb-0">Shopping Cart</h3>
          <p className="text-muted small mb-0">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} ready for pickup</p>
        </div>
        {cartItems.length > 0 && (
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={clearCart}
          >
            Clear Cart
          </button>
        )}
      </div>

      <hr className="mb-4" />

      {cartItems.length === 0 ? (
        <div className="text-center py-5 bg-white border rounded-3 p-4">
          <div className="fs-2 mb-2">🛍️</div>
          <h5 className="fw-bold text-dark">Your cart is empty</h5>
          <p className="text-muted small mb-3">Add items from the shop to place your order.</p>
          <button
            className="btn btn-dark btn-sm px-4"
            onClick={() => navigate("/home")}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          {/* Cart Items List */}
          <div className="col-lg-7">
            <div className="card border shadow-sm rounded-3">
              <div className="list-group list-group-flush">
                {cartItems.map((item, index) => {
                  const rawImg = item.product_photo || item.product_image || item.image || "";
                  const imageUrl = item.isService 
                    ? "" 
                    : rawImg.startsWith("http") || rawImg.startsWith("/") 
                      ? rawImg 
                      : imagepath + rawImg;

                  return (
                    <div
                      key={index}
                      className="list-group-item p-3 d-flex justify-content-between align-items-center"
                    >
                      <div className="d-flex align-items-center">
                        {item.isService ? (
                          <div 
                            className="rounded border bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center me-3"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="bi bi-laptop fs-4"></i>
                          </div>
                        ) : rawImg ? (
                          <img
                            src={imageUrl}
                            alt={item.product_name}
                            style={{
                              width: "60px",
                              height: "60px",
                              objectFit: "cover",
                            }}
                            className="rounded border me-3"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div 
                            className="rounded border bg-light d-flex align-items-center justify-content-center me-3 text-muted"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="bi bi-image fs-4"></i>
                          </div>
                        )}
                        <div>
                          <h6 className="fw-bold text-dark mb-1" style={{ fontSize: "0.95rem" }}>
                            {item.product_name}
                          </h6>
                          <span className="text-secondary small fw-bold d-block">
                            Ksh. {item.product_cost}
                          </span>
                          <small className="text-muted">
                            Qty: {item.quantity || 1}
                          </small>
                        </div>
                      </div>
                      <button
                        className="btn btn-link text-danger text-decoration-none p-0 small"
                        onClick={() => removeItem(index)}
                      >
                        Remove
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Local Order Summary Card */}
          <div className="col-lg-5">
            <div className="card border shadow-sm rounded-3 p-3 bg-white">
              <h5 className="fw-bold text-dark mb-3" style={{ fontSize: "1.1rem" }}>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2 small text-secondary">
                <span>Items Subtotal</span>
                <span>Ksh. {calculateTotal().toLocaleString()}</span>
              </div>
              <div className="d-flex justify-content-between mb-3 small text-secondary">
                <span>Fulfillment Type</span>
                <span className="text-dark fw-medium">Store Pickup Only</span>
              </div>
              <hr className="text-muted my-2" />
              <div className="d-flex justify-content-between mb-3 fw-bold text-dark">
                <span>Total Amount</span>
                <span className="text-success fs-5">
                  Ksh. {calculateTotal().toLocaleString()}
                </span>
              </div>
              <button
                className="btn btn-dark w-100 py-2 fw-bold rounded-2 shadow-sm"
                onClick={handleCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;