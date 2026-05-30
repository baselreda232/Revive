import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import "./Contact.css";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [notification, setNotification] = useState(null);

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setNotification({
      message: "Thank you for contacting us! We'll get back to you soon.",
      type: "success"
    });
    setForm({ name: "", email: "", message: "" });
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

      <div className="contact-container">
        <div className="contact-content">
        <h1>Contact Us</h1>
        <p>Have questions about our furniture? We'd love to hear from you!</p>
        
        <div className="contact-info">
          <div className="info-item">
            <h3>Visit Our Showroom</h3>
            <p>123 Furniture Street, Design District</p>
            <p>Open: Mon-Sat 9AM-7PM, Sun 10AM-5PM</p>
          </div>
          
          <div className="info-item">
            <h3>Call Us</h3>
            <p>Phone: (555) 123-4567</p>
            <p>Email: info@revivefurniture.com</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="contact-form">
          <h2>Send us a Message</h2>
          
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
          />
          
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
          />
          
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            required
            rows="5"
          />
          
          <button type="submit" className="btn btn-dark">Send Message</button>
        </form>
        
        <Link to="/" className="back-link">
          <button className="btn btn-secondary">Back to Home</button>
        </Link>
        </div>
      </div>
    </>
  );
}

export default Contact;
