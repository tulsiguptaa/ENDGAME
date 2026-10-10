import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { getResumes } from "../services/api";
import "./Profile.css";

const Profile = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getResumes()
      .then((data) => {
        if (active) setResumes(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        console.error("Failed to load user resumes for profile:", err);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="profile-page">
      {/* AMBIENT GLOW */}
      <div className="page-background" aria-hidden="true">
        <div className="glow glow-one" />
        <div className="glow glow-two" />
      </div>

      <div className="profile-container">
        {/* HEADER */}
        <header className="profile-header">
          <div className="profile-badge">
            <span>✦</span> CANDIDATE ACCOUNT
          </div>
          <h1>
            Candidate <em>profile</em>
          </h1>
          <p>
            Manage your account credentials, view library metrics, and configure your ENDGAME preferences.
          </p>
        </header>

        {/* PROFILE CARDS GRID */}
        <div className="profile-grid">
          {/* USER INFO CARD */}
          <section className="profile-card">
            <div className="card-topline">
              <span className="card-kicker">IDENTITY</span>
              <span className="card-status-dot active">Active Session</span>
            </div>

            <div className="profile-identity">
              <div className="identity-avatar">
                {(user?.username || "C").charAt(0).toUpperCase()}
              </div>
              <div className="identity-details">
                <h2>{user?.username || "Candidate"}</h2>
                <p>{user?.email || "No email on record"}</p>
              </div>
            </div>

            <div className="profile-info-rows">
              <div className="info-row">
                <span>Account ID</span>
                <strong>#{user?.id ?? "—"}</strong>
              </div>
              <div className="info-row">
                <span>Username</span>
                <strong>{user?.username || "—"}</strong>
              </div>
              <div className="info-row">
                <span>Email Address</span>
                <strong>{user?.email || "—"}</strong>
              </div>
              <div className="info-row">
                <span>Authentication</span>
                <strong className="auth-badge">Session Verified</strong>
              </div>
            </div>
          </section>

          {/* ACTIVITY OVERVIEW CARD */}
          <section className="profile-card">
            <div className="card-topline">
              <span className="card-kicker">ACTIVITY OVERVIEW</span>
              <span className="card-icon">↗</span>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat-box">
                <span className="stat-label">Uploaded Resumes</span>
                <strong className="stat-number">
                  {loading ? "…" : resumes.length}
                </strong>
                <Link to="/resume-upload#resumes" className="stat-link">
                  Manage library →
                </Link>
              </div>

              <div className="profile-stat-box">
                <span className="stat-label">Interview Tracks</span>
                <strong className="stat-number">3</strong>
                <Link to="/interview" className="stat-link">
                  Launch interview →
                </Link>
              </div>
            </div>

            <div className="profile-shortcuts">
              <span className="shortcuts-kicker">QUICK SHORTCUTS</span>
              <div className="shortcuts-list">
                <Link to="/dashboard" className="shortcut-item">
                  <span>Dashboard Command Center</span>
                  <span>→</span>
                </Link>
                <Link to="/resume-upload" className="shortcut-item">
                  <span>Resume Studio</span>
                  <span>→</span>
                </Link>
                <Link to="/interview" className="shortcut-item">
                  <span>AI Mock Interview</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          </section>

          {/* PREFERENCES CARD */}
          <section className="profile-card">
            <div className="card-topline">
              <span className="card-kicker">PREFERENCES</span>
              <span className="card-icon">⌘</span>
            </div>

            <div className="preference-item">
              <div>
                <strong>Display Theme</strong>
                <p>Switch between clean Monochrome Light and deep Dark mode.</p>
              </div>
              <button
                type="button"
                className="theme-switch-btn"
                onClick={toggleTheme}
              >
                {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
              </button>
            </div>

            <div className="preference-item">
              <div>
                <strong>Interview AI Model</strong>
                <p>Real-time prompt engineering with resume context injection.</p>
              </div>
              <span className="active-tag">Active</span>
            </div>
          </section>

          {/* SECURITY & ACTIONS CARD */}
          <section className="profile-card">
            <div className="card-topline">
              <span className="card-kicker">SECURITY & SESSION</span>
              <span className="card-icon">⌁</span>
            </div>

            <div className="security-item">
              <div>
                <strong>Password & Credentials</strong>
                <p>Request a secure password reset link sent to your registered email.</p>
              </div>
              <Link to="/forgot-password" className="action-btn-outline">
                Reset Password
              </Link>
            </div>

            <div className="session-signout-box">
              <div>
                <strong>End Current Session</strong>
                <p>Safely sign out of your ENDGAME account on this device.</p>
              </div>
              <button
                type="button"
                className="signout-button"
                onClick={handleLogout}
              >
                Sign out
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Profile;
