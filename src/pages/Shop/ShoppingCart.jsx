import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/cartStore';
import { formatCurrency } from '../../data/products';
import Notification from '../../components/Notification/Notification';
import './ShoppingCart.css';

function ShoppingCart() {
  const { cartItems, isLoading, updateQuantity, removeItem, clearCart, calculateSubtotal, calculateTax, calculateTotal } = useCart();
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleRemoveItem = (itemId) => {
    removeItem(itemId);
    showNotification('Item removed from cart', 'success');
  };

  const handleClearCart = () => {
    clearCart();
    showNotification('Cart cleared successfully', 'success');
  };

  if (isLoading) {
    return (
      <div className="shopping-cart-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading your cart...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="shopping-cart-container">
        <div className="empty-cart">
          <div className="empty-cart-icon">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h2>Your Cart is Empty</h2>
          <p>Looks like you haven't added any items to your cart yet.</p>
          <Link to="/shop" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
      <div className="shopping-cart-container">
        <div className="cart-header">
          <h1>Shopping Cart</h1>
          <p>{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart</p>
        </div>

      <div className="cart-content">
        <div className="cart-items-section">
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item-card">
                <div className="item-image">
                  <img src={item.image} alt={item.title} />
                </div>
                
                <div className="item-details">
                  <h3>{item.title}</h3>
                  <p className="item-category">{item.category}</p>
                  <p className="item-color">Color: {item.color}</p>
                  <p className="item-price">{formatCurrency(item.price)}</p>
                </div>

                <div className="item-quantity">
                  <label>Quantity</label>
                  <div className="quantity-controls">
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="quantity-value">{item.quantity}</span>
                    <button 
                      className="quantity-btn"
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="item-subtotal">
                  <p>{formatCurrency(item.price * item.quantity)}</p>
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveItem(item._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-actions">
            <Link to="/shop" className="btn btn-secondary">
              Continue Shopping
            </Link>
            <button className="btn btn-danger" onClick={handleClearCart}>
              Clear Cart
            </button>
          </div>
        </div>

        <div className="cart-summary-section">
          <div className="cart-summary">
            <h2>Order Summary</h2>
            
            <div className="summary-row">
              <span>Subtotal</span>
              <span>{formatCurrency(calculateSubtotal())}</span>
            </div>
            
            <div className="summary-row">
              <span>Tax (14%)</span>
              <span>{formatCurrency(calculateTax())}</span>
            </div>
            
            <div className="summary-row total">
              <span>Total</span>
              <span>{formatCurrency(calculateTotal())}</span>
            </div>

            <Link to="/checkout" className="btn btn-primary checkout-btn">
              Proceed to Checkout
            </Link>

            <div className="security-info">
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 22s8-4 8-10V5l-8-3v9c0 6 8 10 8 10z"></path>
                  <path d="m12 22 8-10V5l-8-3"></path>
                </svg>
                <span>Secure Checkout</span>
              </div>
              <div className="security-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="1" y="1" width="22" height="22" rx="2" ry="2"></rect>
                  <path d="M9 9h6v6h-6z"></path>
                </svg>
                <span>SSL Protected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
}

export default ShoppingCart;
