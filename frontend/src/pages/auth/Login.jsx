import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import AuthLayout from "../../components/auth/AuthLayout";
import api from "../../services/api";

import "./Auth.css";

const Login = () => {

    const navigate = useNavigate();

    const { login } = useAuth();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const handleChange = (e) => {

        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setError("");
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!formData.username || !formData.password) {
            setError("Please enter your username and password.");
            return;
        }

        try {

            setLoading(true);
            setError("");

            const response = await api.post(
                "/auth/login/",
                formData
            );

            login(response.data.user);

            navigate("/dashboard");

        } catch (error) {

            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError(
                    "Unable to connect to the server. Please try again."
                );
            }

        } finally {

            setLoading(false);

        }
    };

    const handleGoogleLogin = () => {
        const base = api.defaults.baseURL || "http://localhost:8000/api";
        window.location.href = `${base}/auth/google/`;
    };

    const handleGithubLogin = () => {
        const base = api.defaults.baseURL || "http://localhost:8000/api";
        window.location.href = `${base}/auth/github/`;
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
                        Welcome <em>back</em>
                    </h2>

                    <p>
                        Sign in to continue your interview journey.
                    </p>

                </div>

                {error && (
                    <div className="error-message">
                        <span>!</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>

                    <div className="input-group">

                        <label>
                            Username
                        </label>

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
                                placeholder="Enter your username"
                                value={formData.username}
                                onChange={handleChange}
                                autoComplete="username"
                            />

                        </div>

                    </div>


                    <div className="input-group">

                        <div className="label-row">

                            <label>
                                Password
                            </label>

                            <button
                                type="button"
                                className="forgot-link"
                                onClick={() => navigate("/forgot-password")}
                            >
                                Forgot password?
                            </button>

                        </div>

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
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

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
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
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
                        onClick={handleGoogleLogin}
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
                        onClick={handleGithubLogin}
                    >
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                            <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.2 3.44 9.6 8.21 11.16.6.11.82-.25.82-.57 0-.28-.01-1.02-.02-2-3.34.72-4.04-1.6-4.04-1.6-.55-1.38-1.34-1.75-1.34-1.75-1.09-.74.08-.73.08-.73 1.21.08 1.84 1.23 1.84 1.23 1.07 1.81 2.81 1.29 3.5.99.11-.77.42-1.29.76-1.59-2.67-.3-5.47-1.32-5.47-5.88 0-1.3.47-2.36 1.24-3.19-.13-.3-.54-1.51.11-3.15 0 0 1.01-.32 3.3 1.22a11.6 11.6 0 0 1 6.01 0c2.29-1.54 3.3-1.22 3.3-1.22.65 1.64.24 2.85.12 3.15.77.83 1.23 1.89 1.23 3.19 0 4.57-2.8 5.58-5.48 5.87.43.37.81 1.1.81 2.22 0 1.61-.01 2.9-.01 3.29 0 .32.21.69.83.57A12.02 12.02 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z"/>
                        </svg>
                        GitHub
                    </button>

                </div>


                <p className="signup-text">

                    Don't have an account?

                    <Link to="/signup">
                        Create account
                    </Link>

                </p>

            </div>

        </AuthLayout>
    );
};

export default Login;