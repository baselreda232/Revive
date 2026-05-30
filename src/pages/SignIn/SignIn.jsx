import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import { buildApiUrl, readJsonResponse } from "../../config/api";
import "./SignIn.css";

function SignIn() {
  const [form, setForm] = useState({
    email: "",
    password: ""
  });
  const [notification, setNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const showNotification = (message, type) => {
    setNotification({ message, type });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/customer/login"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        showNotification("Login Successful", "success");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("token", data.token);
        localStorage.setItem("currentUser", JSON.stringify({
          email: data.email || form.email,
          full_name: data.full_name || "User",
          phone_number: data.phone_number || ""
        }));

        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);
      } else {
        showNotification(data.message || "Invalid email or password", "error");
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
      <div className="auth-container">
        <h2>Sign In</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signup-link">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>

        <div className="forgot-password-link">
          <Link to="/forgot-password">Forgot Password?</Link>
        </div>

      </div>
    </>
  );
}

export default SignIn;
