import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { buildApiUrl, readJsonResponse } from "../../config/api";
import "./ResetPassword.css";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!token) {
      setMessage("Invalid reset link");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(buildApiUrl(`/customer/reset-password/${token}`), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newPassword: password,
        }),
      });

      const data = await readJsonResponse(response);

      if (response.ok) {
        setMessage("Password reset successfully!");
        setTimeout(() => {
          navigate("/signin");
        }, 2000);
      } else {
        setMessage(data.message || "Reset failed");
      }
    } catch {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="reset-container">
        <h2>Invalid Reset Link</h2>
        <p>This reset link is invalid or has expired.</p>
        <Link to="/forgot-password">
          <button className="back-button">Request New Link</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="reset-container">
      <h2>Reset Password</h2>
      <p>Create your new password</p>

      {message && (
        <div className={message.includes("success") ? "success-message" : "error-message"}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />

        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength="6"
        />

        <button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>

      <Link to="/signin">
        <button className="back-button">Back to Sign In</button>
      </Link>
    </div>
  );
}

export default ResetPassword;
