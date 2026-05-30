import { Link } from "react-router-dom";
import { useState } from "react";
import "./InnovationConfirmation.css";

function InnovationConfirmation() {
  const [requestData] = useState(() => {
    const storedData = localStorage.getItem('innovationRequest');

    if (!storedData) {
      return null;
    }

    try {
      return JSON.parse(storedData);
    } catch {
      return null;
    }
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return 'Not scheduled';
    }

    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'chairs': 'Chairs',
      'tables': 'Tables',
      'sofas': 'Sofas',
      'beds': 'Beds',
      'storage': 'Storage',
      'lighting': 'Lighting',
      'office': 'Office Furniture',
      'outdoor': 'Outdoor Furniture',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const getInnovationLevelLabel = (level) => {
    const labels = {
      'easy': 'Easy',
      'medium': 'Medium',
      'hard': 'Hard'
    };
    return labels[level] || level;
  };

  return (
    <div className="innovation-confirmation-container">
      <div className="confirmation-content">
        <div className="success-animation">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>

        <h1>Innovation Request Submitted!</h1>
        <p>Your innovative furniture project request has been successfully submitted to our team.</p>

        {requestData && (
          <div className="request-summary">
            <h2>Request Summary</h2>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="label">Category:</span>
                <span className="value">{getCategoryLabel(requestData.category)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Innovation Level:</span>
                <span className="value">{getInnovationLevelLabel(requestData.innovationLevel)}</span>
              </div>
              <div className="summary-item">
                <span className="label">Approval Visit Date:</span>
                <span className="value">{formatDate(requestData.approvalDate)}</span>
              </div>
              <div className="summary-item full-width">
                <span className="label">Project Description:</span>
                <span className="value">{requestData.description}</span>
              </div>
              <div className="summary-item full-width">
                <span className="label">Address:</span>
                <span className="value">
                  {requestData.street}, {requestData.city}, {requestData.state}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="next-steps">
          <h2>What Happens Next?</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot">
                <div className="dot-inner"></div>
              </div>
              <div className="timeline-content">
                <h3>Request Review</h3>
                <p>Our innovation team will review your request within 24 hours</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot">
                <div className="dot-inner"></div>
              </div>
              <div className="timeline-content">
                <h3>Site Visit</h3>
                <p>Our experts will visit your location on the scheduled date</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot">
                <div className="dot-inner"></div>
              </div>
              <div className="timeline-content">
                <h3>Innovation Proposal</h3>
                <p>You'll receive a detailed proposal with innovative solutions</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-dot">
                <div className="dot-inner"></div>
              </div>
              <div className="timeline-content">
                <h3>Project Implementation</h3>
                <p>Once approved, we'll bring your innovative vision to life</p>
              </div>
            </div>
          </div>
        </div>

        <div className="important-notes">
          <h2>Important Information</h2>
          <div className="notes-grid">
            <div className="note-item">
              <div className="note-icon">Email</div>
              <div className="note-content">
                <h3>Confirmation Email</h3>
                <p>You will receive a detailed confirmation email within 48 hours with your request reference number and next steps.</p>
              </div>
            </div>
            
            <div className="note-item">
              <div className="note-icon">Date</div>
              <div className="note-content">
                <h3>Visit Preparation</h3>
                <p>Please ensure the site is accessible on your scheduled visit date. Our team will contact you 24 hours prior to confirm.</p>
              </div>
            </div>
            
            <div className="note-item">
              <div className="note-icon">Idea</div>
              <div className="note-content">
                <h3>Innovation Consultation</h3>
                <p>During the visit, our experts will discuss innovative possibilities and provide recommendations for your space.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h2>Need to Update Your Request?</h2>
          <p>If you need to modify any details or have questions about your innovation request, please contact our team:</p>
          <div className="contact-methods">
            <div className="contact-method">
              <strong>Email:</strong> innovation@reviveef.com
            </div>
            <div className="contact-method">
              <strong>Phone:</strong> +20 123 456 7890
            </div>
            <div className="contact-method">
              <strong>Hours:</strong> Monday - Friday, 9:00 AM - 6:00 PM
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <Link to="/services" className="btn btn-secondary">Back to Services</Link>
          <Link to="/" className="btn btn-primary">Return Home</Link>
        </div>
      </div>
    </div>
  );
}

export default InnovationConfirmation;
