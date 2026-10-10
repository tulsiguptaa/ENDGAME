import React, { useState } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    setMobileMenuOpen(false);
    await logout();
    navigate("/login");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const homeRoute = isAuthenticated ? "/dashboard" : "/login";

  return (
    <nav className="endgame-navbar">
      <div className="navbar-inner">
        {/* BRAND */}
        <Link to={homeRoute} className="navbar-brand" onClick={closeMobileMenu}>
          <span className="navbar-logo" aria-hidden="true">✦</span>
          <span className="navbar-brand-text">ENDGAME</span>
        </Link>

        {/* DESKTOP NAV LINKS (when authenticated) */}
        {isAuthenticated && (
          <div className="navbar-links">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/resume-upload"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Resume Studio
            </NavLink>

            <NavLink
              to="/interview"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Interview
            </NavLink>

            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `navbar-link ${isActive ? "active" : ""}`
              }
            >
              Profile
            </NavLink>
          </div>
        )}

        {/* RIGHT ACTIONS */}
        <div className="navbar-actions">
          {/* THEME TOGGLE */}
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              // Moon icon (switch to dark)
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            ) : (
              // Sun icon (switch to light)
              <svg
                width="17"
                height="17"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
              </svg>
            )}
          </button>

          {isAuthenticated ? (
            <div className="user-nav-group">
              <Link
                to="/profile"
                className="user-pill"
                title="View candidate profile"
              >
                <span className="user-avatar">
                  {(user?.username || "U").charAt(0).toUpperCase()}
                </span>
                <span className="user-name">
                  {user?.username || "Account"}
                </span>
              </Link>

              <button
                type="button"
                className="nav-logout-btn"
                onClick={handleLogout}
                title="Sign out of ENDGAME"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="auth-nav-group">
              {location.pathname !== "/login" && (
                <Link to="/login" className="nav-auth-link">
                  Sign in
                </Link>
              )}
              {location.pathname !== "/signup" && (
                <Link to="/signup" className="nav-auth-cta">
                  Get started
                </Link>
              )}
            </div>
          )}

          {/* MOBILE MENU TOGGLE */}
          {isAuthenticated && (
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? "✕" : "☰"}
            </button>
          )}
        </div>
      </div>

      {/* MOBILE DROPDOWN MENU */}
      {isAuthenticated && mobileMenuOpen && (
        <div className="mobile-nav-drawer">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/resume-upload"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Resume Studio
          </NavLink>
          <NavLink
            to="/interview"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Interview
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `mobile-nav-link ${isActive ? "active" : ""}`
            }
            onClick={closeMobileMenu}
          >
            Profile
          </NavLink>

          <div className="mobile-drawer-footer">
            <button
              type="button"
              className="mobile-logout-btn"
              onClick={handleLogout}
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;