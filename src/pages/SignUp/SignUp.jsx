import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Notification from "../../components/Notification/Notification";
import { buildApiUrl, readJsonResponse } from "../../config/api";
import "./SignUp.css";

function SignUp() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone_number: ""
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
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(buildApiUrl("/customer/signup"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        showNotification("Account Created Successfully", "success");

        if (data.token) {
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("token", data.token);
          localStorage.setItem("currentUser", JSON.stringify({
            full_name: data.full_name || form.full_name,
            email: form.email,
            phone_number: form.phone_number
          }));
        }

        setTimeout(() => {
          navigate(data.token ? "/dashboard" : "/signin");
        }, 1500);
      } else {
        showNotification(data.message || "Registration failed", "error");
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
        <h2>Create Account</h2>

        <form onSubmit={handleSubmit}>
          <input 
            type="text"
            name="full_name"
            placeholder="Full Name"
            value={form.full_name}
            onChange={handleChange}
            required
          />

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

          <input 
            type="tel"
            name="phone_number"
            placeholder="Phone Number"
            value={form.phone_number}
            onChange={handleChange}
            required
            pattern="[0-9]{10,15}"
            title="Phone number must be 10-15 digits"
          />

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="signin-link">
          Already have an account? <Link to="/signin">Sign In</Link>
        </p>
      </div>
    </>
  );
}

export default SignUp;
