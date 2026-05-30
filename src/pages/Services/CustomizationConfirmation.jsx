import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './CustomizationConfirmation.css';

function CustomizationConfirmation() {
  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="confirmation-container">
      <div className="confirmation-content">
        <div className="success-icon">
          <div className="checkmark-circle">
            <div className="checkmark"></div>
          </div>
        </div>
        
        <h1>Request Submitted Successfully!</h1>
        
        <div className="confirmation-message">
          <p>Thank you for your interest in our custom furniture design service.</p>
          <p>We have received your request and our team will review it carefully.</p>
        </div>
        
        <div className="next-steps">
          <h2>What Happens Next?</h2>
          <div className="steps-timeline">
            <div className="step-item">
              <div className="step-number">1</div>
              <div className="step-content">
                <h3>Review Process</h3>
                <p>Our design team will review your customization request within 24 hours.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">2</div>
              <div className="step-content">
                <h3>Consultation</h3>
                <p>We'll contact you to discuss your project in detail and provide initial recommendations.</p>
              </div>
            </div>
            
            <div className="step-item">
              <div className="step-number">3</div>
              <div className="step-content">
                <h3>Design Proposal</h3>
                <p>You'll receive a detailed design proposal with timeline and pricing.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="important-note">
          <div className="note-icon">Time</div>
          <div className="note-content">
            <h3>Important Information</h3>
            <p>Please check your email regularly. You will receive a confirmation email within 48 hours with:</p>
            <ul>
              <li>Request reference number</li>
              <li>Initial design consultation details</li>
              <li>Estimated timeline for your project</li>
              <li>Next steps and required information</li>
            </ul>
          </div>
        </div>
        
        <div className="contact-info">
          <h3>Need to Update Your Request?</h3>
          <p>If you need to make any changes to your request or have questions, please contact us:</p>
          <div className="contact-methods">
            <div className="contact-method">
              <span className="method-icon">Email</span>
              <span>custom@revivee.com</span>
            </div>
            <div className="contact-method">
              <span className="method-icon">Phone</span>
              <span>+20 123 456 7890</span>
            </div>
          </div>
        </div>
        
        <div className="action-buttons">
          <Link to="/services" className="btn btn-secondary">
            Back to Services
          </Link>
          <Link to="/" className="btn btn-primary">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CustomizationConfirmation;
