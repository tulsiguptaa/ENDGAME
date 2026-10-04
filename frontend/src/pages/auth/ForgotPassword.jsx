import { useState } from "react";
import { Link } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import api from "../../services/api";

import "./Auth.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const response = await api.post("/auth/forgot-password/", { email });
      setStatus({
        type: "success",
        message: response.data.message || "Reset link sent successfully.",
      });
      setEmail("");
    } catch (error) {
      const message =
        error.response?.data?.error ||
        "Unable to send reset link. Please try again.";
      setStatus({ type: "error", message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>

      <div className="auth-card">

        <div className="mobile-logo">
          <div className="logo-icon">✦</div>
          <span>ENDGAME</span>
        </div>

        <div className="form-header">
          <h2>
            Forgot <em>password</em>
          </h2>
          <p>
            Enter your registered email and we'll send you a reset link.
          </p>
        </div>

        {status.message && (
          <div
            className={
              status.type === "error"
                ? "error-message"
                : "success-message"
            }
          >
            <span>{status.type === "error" ? "!" : "✓"}</span>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <div className="input-group">
            <label htmlFor="email">Email</label>

            <div className="input-wrapper">
              <span className="input-icon">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="5" width="18" height="14" rx="2" />
                  <path d="m3 7 9 6 9-6" />
                </svg>
              </span>

              <input
                id="email"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="submit-button"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              <>
                Send reset link
                <span>→</span>
              </>
            )}
          </button>
        </form>

        <p className="signup-text">
          Remembered it?
          <Link to="/login">Back to sign in</Link>
        </p>

      </div>

    </AuthLayout>
  );
}

export default ForgotPassword;