import { useState } from "react";
import { Link } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import { buildApiUrl, readJsonResponse } from "../../config/api";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      showNotification("Please enter your email", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/customer/forgot-password"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        showNotification(data.message || "Reset link sent to your email!", "success");
      } else {
        showNotification(data.message || "Failed to send reset link", "error");
      }
    } catch {
      showNotification("Network error. Please try again.", "error");
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
          onClose={closeNotification}
        />
      )}
      <div className="forgot-container">
        <h2>Forgot Password</h2>
        <p>Enter your email to receive a reset link</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        
        <Link to="/" className="back-link">
          <button className="back-button">Back to Home</button>
        </Link>
      </div>
    </>
  );
}
