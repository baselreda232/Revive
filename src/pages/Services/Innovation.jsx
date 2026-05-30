import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BeforeAfter from "../Home/BeforeAfter";
import Calendar from "../../components/Calendar/Calendar";
import Notification from "../../components/Notification/Notification";
import { buildApiUrl, readJsonResponse, getAuthHeaders } from "../../config/api";
import "./Innovation.css";

function Innovation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    innovationLevel: '',
    approvalDate: '',
    street: '',
    city: '',
    state: ''
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message, type = "error") => {
    setNotification({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      showNotification('Please sign in to submit an innovation request.');
      navigate('/signin');
      return;
    }

    if (!formData.category || !formData.description || !formData.innovationLevel || !formData.approvalDate || !formData.street || !formData.city || !formData.state) {
      showNotification('Please fill in all required fields to proceed with your innovation request.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl('/customer/innovation'), {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          category: formData.category,
          project_description: formData.description,
          innovation_level: formData.innovationLevel,
          approval_visit_date: formData.approvalDate,
          street: formData.street,
          city: formData.city,
          state: formData.state
        })
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        showNotification('Innovation request submitted successfully.', 'success');
        setTimeout(() => {
          navigate('/innovation-confirmation');
        }, 600);
      } else {
        showNotification(data.message || 'Failed to submit innovation request.');
      }
    } catch {
      showNotification('Failed to submit innovation request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  
  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}

      <div className="innovation-container">
        <BeforeAfter />

        <div className="innovation-form-container">
        <h1>Innovation Request</h1>
        <p>Transform your space with our cutting-edge furniture innovations</p>
        
        <form className="innovation-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select 
              id="category" 
              name="category" 
              value={formData.category} 
              onChange={handleInputChange}
              required
            >
              <option value="">Select a category</option>
              <option value="chairs">Chairs</option>
              <option value="tables">Tables</option>
              <option value="sofas">Sofas</option>
              <option value="beds">Beds</option>
              <option value="storage">Storage</option>
              <option value="lighting">Lighting</option>
              <option value="office">Office Furniture</option>
              <option value="outdoor">Outdoor Furniture</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="description">Project Description *</label>
            <textarea 
              id="description" 
              name="description" 
              value={formData.description} 
              onChange={handleInputChange}
              placeholder="Describe your innovation project and requirements..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="innovationLevel">Innovation Level *</label>
              <select 
                id="innovationLevel" 
                name="innovationLevel" 
                value={formData.innovationLevel} 
                onChange={handleInputChange}
                required
              >
                <option value="">Select innovation level</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="approvalDate">Approval Visit Date *</label>
              <Calendar 
                selectedDate={formData.approvalDate} 
                onDateSelect={(date) => setFormData(prev => ({ ...prev, approvalDate: date }))}
                placeholder="Select approval visit date"
              />
            </div>
          </div>

          <div className="address-section">
            <h3>Address Information *</h3>
            <div className="form-group">
              <label htmlFor="street">Street Address</label>
              <input 
                type="text" 
                id="street" 
                name="street" 
                value={formData.street} 
                onChange={handleInputChange}
                placeholder="Enter your street address"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  name="city" 
                  value={formData.city} 
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="state">State</label>
                <input 
                  type="text" 
                  id="state" 
                  name="state" 
                  value={formData.state} 
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Innovation Request'}
          </button>
        </form>
        </div>
      </div>
    </>
  );
}

export default Innovation;
