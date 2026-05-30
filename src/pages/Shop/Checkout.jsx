import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification/Notification';
import { useCart } from '../../contexts/cartStore';
import { buildApiUrl, readJsonResponse, getAuthHeaders } from '../../config/api';
import { formatCurrency } from '../../data/products';
import './Checkout.css';

const TAX_RATE = 0.14;
const SHIPPING_FEE = 50;
const FREE_SHIPPING_THRESHOLD = 2000;

function Checkout() {
  const navigate = useNavigate();
  const { cartItems, isLoading, clearCart, fetchCart } = useCart();
  const [currentStep, setCurrentStep] = useState(1);
  const [customerProfile, setCustomerProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [customerAddresses, setCustomerAddresses] = useState([]);
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    country: 'Egypt',
    postalCode: ''
  });
  const [useExistingAddress, setUseExistingAddress] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentInfo, setPaymentInfo] = useState({
    payment_method: 'cash'
  });
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);

  const fetchCustomerData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    setIsLoadingProfile(true);
    try {
      const response = await fetch(buildApiUrl('/customer/profile'), {
        headers: getAuthHeaders()
      });

      const data = await readJsonResponse(response);
      if (response.ok && data.customer) {
        const customer = data.customer;
        setCustomerProfile({
          firstName: customer.full_name?.split(' ')[0] || '',
          lastName: customer.full_name?.split(' ').slice(1).join(' ') || '',
          email: customer.email || '',
          phone: customer.phone_number || ''
        });
        setCustomerAddresses(customer.addresses || []);
        
        if (customer.addresses && customer.addresses.length > 0) {
          const defaultAddr = customer.addresses.find(addr => addr.is_default) || customer.addresses[0];
          setSelectedAddressId(defaultAddr._id);
          setUseExistingAddress(true);
          setShippingInfo({
            firstName: customer.full_name?.split(' ')[0] || '',
            lastName: customer.full_name?.split(' ').slice(1).join(' ') || '',
            email: customer.email || '',
            phone: customer.phone_number || '',
            street: defaultAddr.street || '',
            city: defaultAddr.city || '',
            state: defaultAddr.state || '',
            country: defaultAddr.country || 'Egypt',
            postalCode: ''
          });
        } else {
          setShippingInfo({
            firstName: customer.full_name?.split(' ')[0] || '',
            lastName: customer.full_name?.split(' ').slice(1).join(' ') || '',
            email: customer.email || '',
            phone: customer.phone_number || '',
            street: '',
            city: '',
            state: '',
            country: 'Egypt',
            postalCode: ''
          });
        }
      }
    } catch {
      // Error fetching customer data
    } finally {
      setIsLoadingProfile(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchCustomerData();
  }, [fetchCustomerData]);

  const orderSummary = useMemo(() => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    const tax = subtotal * TAX_RATE;
    const shipping = subtotal === 0 || subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    return {
      subtotal,
      tax,
      shipping,
      total: subtotal + tax + shipping
    };
  }, [cartItems]);

  const showNotification = (message, type = 'error') => {
    setNotification({ message, type });
  };

  const getSelectedAddress = () =>
    customerAddresses.find(address => address._id === selectedAddressId);

  const handleShippingSubmit = async (event) => {
    event.preventDefault();

    if (cartItems.length === 0) {
      showNotification('Your cart is empty. Add products before checkout.');
      return;
    }

    if (useExistingAddress) {
      const selectedAddress = getSelectedAddress();

      if (!selectedAddress) {
        showNotification('Please select a shipping address.');
        return;
      }

      setShippingInfo({
        firstName: customerProfile.firstName,
        lastName: customerProfile.lastName,
        email: customerProfile.email,
        phone: customerProfile.phone,
        street: selectedAddress.street,
        city: selectedAddress.city,
        state: selectedAddress.state,
        country: selectedAddress.country,
        postalCode: selectedAddress.postalCode || ''
      });
    } else if (
      !shippingInfo.firstName ||
      !shippingInfo.lastName ||
      !shippingInfo.email ||
      !shippingInfo.phone ||
      !shippingInfo.street ||
      !shippingInfo.city ||
      !shippingInfo.state
    ) {
      showNotification('Please fill in all required shipping information.');
      return;
    }

    // If adding new address, save it to backend
    if (!useExistingAddress) {
      try {
        const response = await fetch(buildApiUrl('/customer/addresses'), {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify({
            street: shippingInfo.street,
            city: shippingInfo.city,
            state: shippingInfo.state,
            country: shippingInfo.country,
            is_default: customerAddresses.length === 0
          })
        });

        if (response.ok) {
          await fetchCustomerData();
        }
      } catch {
        // Error saving address
      }
    }

    setCurrentStep(2);
  };

  const handlePaymentSubmit = async (event) => {
    event.preventDefault();

    if (!paymentInfo.payment_method) {
      showNotification('Please select a payment method.');
      return;
    }

    if (cartItems.length === 0) {
      showNotification('Your cart is empty. Add products before checkout.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    setIsProcessingPayment(true);

    const addressId = useExistingAddress ? selectedAddressId : null;

    try {
      const response = await fetch(buildApiUrl('/customer/checkout'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          address_id: addressId,
          payment_method: paymentInfo.payment_method
        })
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        setOrderData({
          order_id: data.order._id,
          total: data.order.pricing.total,
          payment_method: data.order.payment_method,
          order_date: data.order.order_date,
          status: 'confirmed',
          shipping: data.order.shipping_address,
          items: data.order.items
        });
        setShowOrderConfirmation(true);
        showNotification('Order placed successfully.', 'success');
        await fetchCart();
      } else {
        if (data.requires_address) {
          showNotification('Please add an address before checkout.');
          setCurrentStep(1);
          setUseExistingAddress(false);
        } else {
          showNotification(data.message || 'Failed to process order. Please try again.');
        }
      }
    } catch {
      showNotification('Failed to process order. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const finishOrder = (path) => {
    clearCart();
    setShowOrderConfirmation(false);
    navigate(path);
  };

  const steps = [
    { number: 1, title: 'Shipping', description: 'Delivery information' },
    { number: 2, title: 'Payment', description: 'Payment method' }
  ];

  if (isLoading || isLoadingProfile) {
    return (
      <div className="checkout-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !showOrderConfirmation) {
    return (
      <div className="checkout-container">
        <div className="empty-checkout">
          <h2>Your cart is empty</h2>
          <p>Add furniture to your cart before starting checkout.</p>
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
          onClose={() => setNotification(null)}
        />
      )}

      <div className="checkout-container">
        <div className="checkout-header">
          <h1>Checkout</h1>
          <div className="checkout-steps">
            {steps.map(step => (
              <div key={step.number} className={`step ${currentStep >= step.number ? 'active' : ''}`}>
                <div className="step-number">{step.number}</div>
                <div className="step-info">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="checkout-content">
          <div className="checkout-main">
            {currentStep === 1 && (
              <div className="checkout-section">
                <h2>Shipping Information</h2>

                <div className="address-selection">
                  {useExistingAddress && (
                    <div className="customer-info-display">
                      <h4>Shipping to: {customerProfile.firstName} {customerProfile.lastName}</h4>
                      <p>Email: {customerProfile.email}</p>
                      <p>Phone: {customerProfile.phone}</p>
                    </div>
                  )}

                  <div className="address-toggle">
                    {customerAddresses.length > 0 && (
                      <label className="radio-option">
                        <input
                          type="radio"
                          name="addressOption"
                          checked={useExistingAddress}
                          onChange={() => setUseExistingAddress(true)}
                        />
                        Use existing address
                      </label>
                    )}
                    <label className="radio-option">
                      <input
                        type="radio"
                        name="addressOption"
                        checked={!useExistingAddress}
                        onChange={() => setUseExistingAddress(false)}
                      />
                      Add new address
                    </label>
                  </div>
                </div>

                <form onSubmit={handleShippingSubmit} className="checkout-form">
                  {useExistingAddress ? (
                    <div className="existing-addresses">
                      <div className="form-group">
                        <label htmlFor="saved-address">Select Shipping Address *</label>
                        <select
                          id="saved-address"
                          value={selectedAddressId}
                          onChange={(event) => setSelectedAddressId(event.target.value)}
                          required
                        >
                          <option value="">Choose an address</option>
                          {customerAddresses.map(address => (
                            <option key={address._id} value={address._id}>
                              {address.is_default ? 'Default: ' : ''}{address.street}, {address.city}, {address.state}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <div className="new-address-form">
                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="firstName">First Name *</label>
                          <input
                            id="firstName"
                            type="text"
                            value={shippingInfo.firstName}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, firstName: event.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="lastName">Last Name *</label>
                          <input
                            id="lastName"
                            type="text"
                            value={shippingInfo.lastName}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, lastName: event.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="email">Email *</label>
                          <input
                            id="email"
                            type="email"
                            value={shippingInfo.email}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, email: event.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="phone">Phone *</label>
                          <input
                            id="phone"
                            type="tel"
                            value={shippingInfo.phone}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, phone: event.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="street">Street Address *</label>
                        <input
                          id="street"
                          type="text"
                          value={shippingInfo.street}
                          onChange={(event) => setShippingInfo({ ...shippingInfo, street: event.target.value })}
                          required
                        />
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="city">City *</label>
                          <input
                            id="city"
                            type="text"
                            value={shippingInfo.city}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, city: event.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="state">State *</label>
                          <input
                            id="state"
                            type="text"
                            value={shippingInfo.state}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, state: event.target.value })}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label htmlFor="country">Country</label>
                          <input
                            id="country"
                            type="text"
                            value={shippingInfo.country}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, country: event.target.value })}
                          />
                        </div>
                        <div className="form-group">
                          <label htmlFor="postalCode">Postal Code</label>
                          <input
                            id="postalCode"
                            type="text"
                            value={shippingInfo.postalCode}
                            onChange={(event) => setShippingInfo({ ...shippingInfo, postalCode: event.target.value })}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">
                      Continue to Payment
                    </button>
                  </div>
                </form>
              </div>
            )}

            {currentStep === 2 && (
              <div className="checkout-section">
                <h2>Payment Information</h2>
                <form onSubmit={handlePaymentSubmit} className="checkout-form">
                  <div className="payment-methods">
                    <div className="form-group">
                      <label>Payment Method *</label>
                      <div className="payment-options">
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="payment_method"
                            value="cash"
                            checked={paymentInfo.payment_method === 'cash'}
                            onChange={(event) => setPaymentInfo({ payment_method: event.target.value })}
                            required
                          />
                          <div className="payment-option-content">
                            <span className="payment-title">Cash on Delivery</span>
                            <span className="payment-description">Pay when you receive your order</span>
                          </div>
                        </label>
                        <label className="radio-option">
                          <input
                            type="radio"
                            name="payment_method"
                            value="instapay"
                            checked={paymentInfo.payment_method === 'instapay'}
                            onChange={(event) => setPaymentInfo({ payment_method: event.target.value })}
                            required
                          />
                          <div className="payment-option-content">
                            <span className="payment-title">Instapay</span>
                            <span className="payment-description">Pay instantly via Instapay</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="payment-security">
                    <div className="security-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="1" width="22" height="22" rx="2" ry="2"></rect>
                        <path d="M9 9h6v6h-6z"></path>
                      </svg>
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="security-badge">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M12 22s8-4 8-10V5l-8-3v9c0 6 8 10 8 10z"></path>
                        <path d="m12 22 8-10V5l-8-3"></path>
                      </svg>
                      <span>Secure Payment</span>
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setCurrentStep(1)}
                    >
                      Back to Shipping
                    </button>
                    <button type="submit" className="btn btn-primary" disabled={isProcessingPayment}>
                      {isProcessingPayment
                        ? 'Processing...'
                        : `Place Order - ${formatCurrency(orderSummary.total)}`}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h2>Order Summary</h2>

              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item._id} className="summary-item">
                    <div className="item-info">
                      <h4>{item.title}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="total-row">
                  <span>Subtotal</span>
                  <span>{formatCurrency(orderSummary.subtotal)}</span>
                </div>
                <div className="total-row">
                  <span>Tax (14%)</span>
                  <span>{formatCurrency(orderSummary.tax)}</span>
                </div>
                <div className="total-row">
                  <span>Shipping</span>
                  <span>{orderSummary.shipping === 0 ? 'FREE' : formatCurrency(orderSummary.shipping)}</span>
                </div>
                <div className="total-row final-total">
                  <span>Total</span>
                  <span>{formatCurrency(orderSummary.total)}</span>
                </div>
              </div>

              {orderSummary.shipping === 0 && orderSummary.subtotal > 0 && (
                <div className="free-shipping-badge">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27,6.96 12,12.01 20.73,6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  <span>Free Shipping on orders over EGP 2,000</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {showOrderConfirmation && orderData && (
          <div className="order-confirmation-overlay">
            <div className="order-confirmation-modal">
              <div className="modal-header">
                <h2>Order Confirmation</h2>
                <button
                  className="close-btn"
                  onClick={() => finishOrder('/shop')}
                  type="button"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>

              <div className="modal-content">
                {orderData.payment_method === 'instapay' ? (
                  <div className="instapay-payment">
                    <div className="success-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3>Order Placed Successfully!</h3>
                    <p>Order ID: <strong>{orderData.order_id}</strong></p>
                    <p>Total Amount: <strong>{formatCurrency(orderData.total)}</strong></p>

                    <div className="qr-section">
                      <h4>Complete Payment with Instapay</h4>
                      <p>Scan the QR code below to complete your payment</p>

                      <div className="qr-code">
                        <div className="qr-placeholder">
                          <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                            <rect x="7" y="7" width="3" height="3"></rect>
                            <rect x="14" y="7" width="3" height="3"></rect>
                            <rect x="7" y="14" width="3" height="3"></rect>
                            <rect x="14" y="14" width="3" height="3"></rect>
                            <rect x="10" y="10" width="4" height="4"></rect>
                          </svg>
                        </div>
                        <p className="qr-amount">{formatCurrency(orderData.total)}</p>
                      </div>

                      <div className="payment-instructions">
                        <p><strong>Instructions:</strong></p>
                        <ol>
                          <li>Open your Instapay app</li>
                          <li>Scan the QR code above</li>
                          <li>Confirm the payment amount</li>
                          <li>Complete the transaction</li>
                        </ol>
                      </div>

                      <div className="payment-status">
                        <span className="status-badge pending">Awaiting Payment</span>
                        <p className="status-text">We'll confirm your order once payment is received</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="cash-payment">
                    <div className="success-icon">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                      </svg>
                    </div>
                    <h3>Order Confirmed!</h3>
                    <p>Order ID: <strong>{orderData.order_id}</strong></p>
                    <p>Total Amount: <strong>{formatCurrency(orderData.total)}</strong></p>
                    <p>Payment Method: <strong>Cash on Delivery</strong></p>

                    <div className="order-details">
                      <h4>Order Details</h4>
                      <p>Your order has been confirmed and will be delivered to your selected address.</p>
                      <p>You will pay the full amount upon delivery.</p>

                      <div className="delivery-info">
                        <span className="status-badge confirmed">Order Confirmed</span>
                        <p className="delivery-text">Estimated delivery: 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => finishOrder('/shop')}
                    type="button"
                  >
                    Continue Shopping
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => finishOrder('/dashboard')}
                    type="button"
                  >
                    View Orders
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Checkout;
