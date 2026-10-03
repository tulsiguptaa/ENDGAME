import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthLayout from "../../components/auth/AuthLayout";
import api from "../../services/api";

import "./Auth.css";

const Signup = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
        setSuccess("");
    };

    const validateForm = () => {
        if (
            !formData.username ||
            !formData.email ||
            !formData.password ||
            !formData.confirmPassword
        ) {
            return "Please fill in all fields.";
        }

        if (formData.username.length < 3) {
            return "Username must be at least 3 characters.";
        }

        if (!formData.email.includes("@")) {
            return "Please enter a valid email address.";
        }

        if (formData.password.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (formData.password !== formData.confirmPassword) {
            return "Passwords do not match.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await api.post("/auth/signup/", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
            });

            setSuccess(
                "Account created successfully! Redirecting..."
            );

            setTimeout(() => {
                navigate("/login");
            }, 1200);

        } catch (error) {
            const data = error.response?.data;

            if (data?.username) {
                setError(data.username[0]);
            } else if (data?.email) {
                setError(data.email[0]);
            } else if (data?.password) {
                setError(data.password[0]);
            } else {
                setError(
                    "Unable to create account. Please try again."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignup = () => {
        window.location.href =
            "http://127.0.0.1:8000/api/auth/google/";
    };

    const handleGithubSignup = () => {
        window.location.href =
            "http://127.0.0.1:8000/api/auth/github/";
    };

    return (
        <AuthLayout>

            <div className="auth-card signup-card">

                <div className="mobile-logo">
                    <div className="logo-icon">✦</div>
                    <span>ENDGAME</span>
                </div>

                <div className="form-header">

                    <h2>
                        Create <em>account</em>
                    </h2>

                    <p>
                        Start your AI-powered interview journey.
                    </p>

                </div>

                {error && (
                    <div className="error-message">
                        <span>!</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="success-message">
                        <span>✓</span>
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    {/* USERNAME */}

                    <div className="input-group">

                        <label>Username</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>

                            <input
                                type="text"
                                name="username"
                                placeholder="Choose a username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />

                        </div>

                    </div>

                    {/* EMAIL */}

                    <div className="input-group">

                        <label>Email</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="5" width="18" height="14" rx="2" />
                                    <path d="m3 7 9 6 9-6" />
                                </svg>
                            </span>

                            <input
                                type="email"
                                name="email"
                                placeholder="you@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                autoComplete="email"
                            />

                        </div>

                    </div>

                    {/* PASSWORD */}

                    <div className="input-group">

                        <label>Password</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="11" width="16" height="10" rx="2" />
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                                </svg>
                            </span>

                            <input
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                name="password"
                                placeholder="Create a strong password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>

                        {/* PASSWORD STRENGTH */}

                        {formData.password && (
                            <div className="password-strength">

                                <div className="strength-bars">

                                    <span
                                        className={
                                            formData.password.length >= 1
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            formData.password.length >= 6
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            formData.password.length >= 8
                                                ? "active"
                                                : ""
                                        }
                                    />

                                    <span
                                        className={
                                            /[A-Z]/.test(
                                                formData.password
                                            ) &&
                                            /[0-9]/.test(
                                                formData.password
                                            )
                                                ? "active"
                                                : ""
                                        }
                                    />

                                </div>

                                <small>
                                    Use 8+ characters with
                                    numbers and uppercase letters.
                                </small>

                            </div>
                        )}

                    </div>

                    {/* CONFIRM PASSWORD */}

                    <div className="input-group">

                        <label>Confirm password</label>

                        <div className="input-wrapper">

                            <span className="input-icon">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="4" y="11" width="16" height="10" rx="2" />
                                    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
                                </svg>
                            </span>

                            <input
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                name="confirmPassword"
                                placeholder="Confirm your password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {/* TERMS */}

                    <div className="terms-row">

                        <input
                            type="checkbox"
                            id="terms"
                            required
                        />

                        <label htmlFor="terms">
                            I agree to the Terms of Service
                            and Privacy Policy.
                        </label>

                    </div>

                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="submit-button"
                        disabled={loading}
                    >

                        {loading ? (
                            <>
                                <span className="spinner"></span>
                                Creating account...
                            </>
                        ) : (
                            <>
                                Create account
                                <span>→</span>
                            </>
                        )}

                    </button>

                </form>

                <div className="divider">
                    <span>OR</span>
                </div>

                <div className="social-grid">

                    <button
                        type="button"
                        className="social-button"
                        onClick={handleGoogleSignup}
                    >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Google
                    </button>

                    <button
                        type="button"
                        className="social-button"
                        onClick={handleGithubSignup}
                    >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.72-4.04-1.6-4.04-1.6-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.23 1.84 1.23 1.07 1.81 2.81 1.29 3.5.99.11-.77.42-1.29.76-1.59-2.67-.3-5.47-1.32-5.47-5.88 0-1.3.47-2.36 1.24-3.19-.13-.3-.54-1.51.11-3.15 0 0 1.01-.32 3.3 1.22a11.6 11.6 0 0 1 6.01 0c2.29-1.54 3.3-1.22 3.3-1.22.65 1.64.24 2.85.12 3.15.77.83 1.23 1.89 1.23 3.19 0 4.57-2.8 5.58-5.48 5.87.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.69.83.57A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/>
                        </svg>
                        GitHub
                    </button>

                </div>

                <p className="signup-text">

                    Already have an account?

                    <Link to="/login">
                        Sign in
                    </Link>

                </p>

            </div>

        </AuthLayout>
    );
};

export default Signup;