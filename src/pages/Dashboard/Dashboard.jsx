import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Notification from '../../components/Notification/Notification';
import { buildApiUrl, readJsonResponse, getAuthHeaders } from '../../config/api';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone_number: ''
  });
  const [addresses, setAddresses] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customizations, setCustomizations] = useState([]);
  const [innovations, setInnovations] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [newAddress, setNewAddress] = useState({
    street: '',
    city: '',
    state: '',
    country: 'Egypt',
    is_default: false
  });

  const fetchProfileData = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/customer/profile'), {
        headers: getAuthHeaders()
      });

      const data = await readJsonResponse(response);
      if (response.ok && data.customer) {
        // Preserve phone_number from localStorage if backend doesn't have it
        const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
        setProfileData({
          full_name: data.customer.full_name || '',
          email: data.customer.email || '',
          phone_number: data.customer.phone_number || currentUser.phone_number || ''
        });
        setAddresses(data.customer.addresses || []);
      }
    } catch {
      // Error fetching profile
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/customer/orders'), {
        headers: getAuthHeaders()
      });

      const data = await readJsonResponse(response);
      if (response.ok && data.orders) {
        setOrders(data.orders);
      }
    } catch {
      // Error fetching orders
    }
  }, []);

  const fetchCustomizations = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/customer/customization'), {
        headers: getAuthHeaders()
      });

      const data = await readJsonResponse(response);
      if (response.ok && data.customizations) {
        setCustomizations(data.customizations);
      }
    } catch {
      // Error fetching customizations
    }
  }, []);

  const fetchInnovations = useCallback(async () => {
    try {
      const response = await fetch(buildApiUrl('/customer/innovation'), {
        headers: getAuthHeaders()
      });

      const data = await readJsonResponse(response);
      if (response.ok && data.innovations) {
        setInnovations(data.innovations);
      }
    } catch {
      // Error fetching innovations
    }
  }, []);

  const fetchDashboardData = useCallback(async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/signin');
      return;
    }

    setIsLoading(true);
    try {
      if (activeTab === 'profile' || activeTab === 'addresses') {
        await fetchProfileData();
      } else if (activeTab === 'orders') {
        await fetchOrders();
      } else if (activeTab === 'customizations') {
        await fetchCustomizations();
      } else if (activeTab === 'innovations') {
        await fetchInnovations();
      }
    } catch {
      // Error fetching dashboard data
    } finally {
      setIsLoading(false);
    }
  }, [activeTab, fetchCustomizations, fetchInnovations, fetchOrders, fetchProfileData, navigate]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (currentUser.full_name || currentUser.email || currentUser.phone_number) {
      setProfileData({
        full_name: currentUser.full_name || '',
        email: currentUser.email || '',
        phone_number: currentUser.phone_number || ''
      });
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(buildApiUrl('/customer/profile'), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          full_name: profileData.full_name,
          phone_number: profileData.phone_number
        })
      });

      const data = await readJsonResponse(response);
      if (response.ok) {
        setIsEditing(false);
        showNotification('Profile updated successfully!');
        await fetchProfileData();
      } else {
        showNotification(data.message || 'Failed to update profile');
      }
    } catch {
      showNotification('Failed to update profile');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(buildApiUrl('/customer/addresses'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(newAddress)
      });

      const data = await readJsonResponse(response);
      if (response.ok) {
        setNewAddress({
          street: '',
          city: '',
          state: '',
          country: 'Egypt',
          is_default: false
        });
        setShowAddAddress(false);
        showNotification('Address added successfully!');
        await fetchProfileData();
      } else {
        showNotification(data.message || 'Failed to add address');
      }
    } catch {
      showNotification('Failed to add address');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    
    try {
      const response = await fetch(buildApiUrl(`/customer/addresses/${addressId}`), {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      if (response.ok) {
        showNotification('Address deleted successfully!');
        await fetchProfileData();
      } else {
        showNotification('Failed to delete address');
      }
    } catch {
      showNotification('Failed to delete address');
    }
  };

  const handleSetDefaultAddress = async (addressId) => {
    
    try {
      const response = await fetch(buildApiUrl(`/customer/addresses/${addressId}`), {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ is_default: true })
      });

      if (response.ok) {
        showNotification('Default address updated!');
        await fetchProfileData();
      } else {
        showNotification('Failed to set default address');
      }
    } catch {
      showNotification('Failed to set default address');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'status-success';
      case 'processing': return 'status-processing';
      case 'pending': return 'status-pending';
      case 'under_review': return 'status-processing';
      case 'approved': return 'status-success';
      case 'rejected': return 'status-error';
      default: return 'status-pending';
    }
  };

  const getStatusText = (status) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <>
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            onClose={() => setNotification(null)}
          />
        )}
        <div className="dashboard-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </>
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

      <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Customer Dashboard</h1>
        <p>Manage your profile, orders, and service requests</p>
      </div>

      <div className="dashboard-content">
        {/* Sidebar Navigation */}
        <div className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <span className="nav-icon"></span>
              Profile Information
            </button>
            <button
              className={`nav-item ${activeTab === 'addresses' ? 'active' : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              <span className="nav-icon"></span>
              Addresses
            </button>
            <button
              className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <span className="nav-icon"></span>
              Order History
            </button>
            <button
              className={`nav-item ${activeTab === 'customizations' ? 'active' : ''}`}
              onClick={() => setActiveTab('customizations')}
            >
              <span className="nav-icon"></span>
              Customization Requests
            </button>
            <button
              className={`nav-item ${activeTab === 'innovations' ? 'active' : ''}`}
              onClick={() => setActiveTab('innovations')}
            >
              <span className="nav-icon"></span>
              Innovation Requests
            </button>
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="dashboard-main">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <h2>Profile Information</h2>
              <div className="profile-section">
                {isEditing ? (
                  <form onSubmit={handleProfileUpdate} className="profile-form">
                    <div className="form-group">
                      <label>Full Name</label>
                      <input
                        type="text"
                        value={profileData.full_name}
                        onChange={(e) => setProfileData({...profileData, full_name: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone Number</label>
                      <input
                        type="tel"
                        value={profileData.phone_number}
                        onChange={(e) => setProfileData({...profileData, phone_number: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Save Changes</button>
                      <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="profile-display">
                    <div className="info-grid">
                      <div className="info-item">
                        <label>Full Name</label>
                        <p>{profileData.full_name}</p>
                      </div>
                      <div className="info-item">
                        <label>Email</label>
                        <p>{profileData.email}</p>
                      </div>
                      <div className="info-item">
                        <label>Phone Number</label>
                        <p>{profileData.phone_number}</p>
                      </div>
                    </div>
                    <button 
                      className="btn btn-primary edit-btn" 
                      onClick={() => setIsEditing(true)}
                    >
                      Edit Profile
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <div className="tab-content">
              <div className="tab-header">
                <h2>My Addresses</h2>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setShowAddAddress(true)}
                >
                  Add New Address
                </button>
              </div>

              {showAddAddress && (
                <div className="add-address-form">
                  <h3>Add New Address</h3>
                  <form onSubmit={handleAddAddress}>
                    <div className="form-group">
                      <label>Street Address</label>
                      <input
                        type="text"
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                        required
                      />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>State</label>
                        <input
                          type="text"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({...newAddress, state: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>
                        <input
                          type="checkbox"
                          checked={newAddress.is_default}
                          onChange={(e) => setNewAddress({...newAddress, is_default: e.target.checked})}
                        />
                        Set as default address
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="submit" className="btn btn-primary">Add Address</button>
                      <button 
                        type="button" 
                        className="btn btn-secondary" 
                        onClick={() => setShowAddAddress(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              <div className="addresses-list">
                {addresses.map(address => (
                  <div key={address._id} className="address-card">
                    {address.is_default && <span className="default-badge">Default</span>}
                    <div className="address-details">
                      <p><strong>Street:</strong> {address.street}</p>
                      <p><strong>City:</strong> {address.city}</p>
                      <p><strong>State:</strong> {address.state}</p>
                      <p><strong>Country:</strong> {address.country}</p>
                    </div>
                    <div className="address-actions">
                      {!address.is_default && (
                        <button 
                          className="btn btn-sm btn-secondary"
                          onClick={() => handleSetDefaultAddress(address._id)}
                        >
                          Set Default
                        </button>
                      )}
                      <button 
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDeleteAddress(address._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <div className="tab-content">
              <h2>Order History</h2>
              {orders.length === 0 ? (
                <p>No orders yet.</p>
              ) : (
                <div className="orders-list">
                  {orders.map(order => (
                    <div key={order._id} className="order-card">
                      <div className="order-header">
                        <div>
                          <h3>Order #{order._id}</h3>
                          <p>Order Date: {new Date(order.order_date).toLocaleDateString()}</p>
                        </div>
                        <span className={`status-badge ${getStatusColor(order.status)}`}>
                          {getStatusText(order.status)}
                        </span>
                      </div>
                      <div className="order-items">
                        {order.items.map((item, index) => (
                          <div key={index} className="order-item">
                            <span>{item.product_title || item.title}</span>
                            <span>Qty: {item.quantity}</span>
                            <span>EGP {item.unit_price || item.price}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-total">
                        <strong>Total: EGP {order.pricing?.total || order.total_amount}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Customizations Tab */}
          {activeTab === 'customizations' && (
            <div className="tab-content">
              <h2>Customization Requests</h2>
              {customizations.length === 0 ? (
                <p>No customization requests yet.</p>
              ) : (
                <div className="requests-list">
                  {customizations.map(request => (
                    <div key={request._id} className="request-card">
                      <div className="request-header">
                        <h3>{request.category}</h3>
                        <span className={`status-badge ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <p><strong>Description:</strong> {request.project_description}</p>
                      <p><strong>Material:</strong> {request.preferred_material}</p>
                      <p><strong>Color Finish:</strong> {request.color_finish}</p>
                      <p><strong>Submitted:</strong> {new Date(request.submission_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Innovations Tab */}
          {activeTab === 'innovations' && (
            <div className="tab-content">
              <h2>Innovation Requests</h2>
              {innovations.length === 0 ? (
                <p>No innovation requests yet.</p>
              ) : (
                <div className="requests-list">
                  {innovations.map(request => (
                    <div key={request._id} className="request-card">
                      <div className="request-header">
                        <h3>{request.category}</h3>
                        <span className={`status-badge ${getStatusColor(request.status)}`}>
                          {getStatusText(request.status)}
                        </span>
                      </div>
                      <p><strong>Description:</strong> {request.project_description}</p>
                      <p><strong>Innovation Level:</strong> {getStatusText(request.innovation_level)}</p>
                      <p><strong>Visit Date:</strong> {new Date(request.approval_visit_date).toLocaleDateString()}</p>
                      <p><strong>Submitted:</strong> {new Date(request.submission_date).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </>
  );
}

export default Dashboard;
