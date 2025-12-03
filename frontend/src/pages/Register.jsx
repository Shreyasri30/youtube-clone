// User Registration logic with password validation
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simple password strength rules:
  // - Min 8 characters
  // - At least 1 uppercase
  // - At least 1 lowercase
  // - At least 1 digit
  // - At least 1 special character
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter (A-Z).";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter (a-z).";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one digit (0-9).";
    }
    if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      return "Password must contain at least one special character (e.g. ! @ # $ %).";
    }
    return "";
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Frontend password validation before hitting the API
    const passwordError = validatePassword(form.password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      const res = await api.post("/auth/register", form);
      setSuccess(res.data.message || "Registered successfully");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo-circle">G</div>
          <h2 className="auth-title">Create your account</h2>
          <p className="auth-subtitle">for YouTube Clone</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
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
          {/* Optional helper text to guide the user */}
          <small style={{ fontSize: "12px", color: "#5f6368" }}>
            Password must be at least 8 characters and include upper, lower, digit and special character.
          </small>

          {error && <p className="error-text">{error}</p>}
          {success && <p className="success-text">{success}</p>}
          <button type="submit">Next</button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <Link to="/login">Sign in instead</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
