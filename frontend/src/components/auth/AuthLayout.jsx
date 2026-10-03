import React from "react";
import "./AuthLayout.css";

const AuthLayout = ({ children }) => {
    return (
        <div className="auth-page">

            <div className="auth-background">
                <div className="glow glow-one"></div>
                <div className="glow glow-two"></div>
            </div>

            <div className="auth-container">

                {/* LEFT SIDE */}
                <div className="auth-brand">

                    <div className="brand-logo">
                        <div className="logo-icon">✦</div>
                        <span>ENDGAME</span>
                    </div>

                    <div className="brand-content">

                        <div className="ai-badge">
                            <span>✦</span>
                            AI-Powered Interview Practice
                        </div>

                        <h1>
                            Practice smarter.
                            <br />
                            <span>Interview better.</span>
                        </h1>

                        <p>
                            Prepare for your next interview with
                            AI-powered mock interviews, personalized
                            questions and intelligent feedback.
                        </p>

                        <div className="feature-list">

                            <div className="feature">
                                <div className="feature-icon">✦</div>
                                <div>
                                    <strong>AI Mock Interviews</strong>
                                    <p>Practice realistic interview scenarios.</p>
                                </div>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">⌁</div>
                                <div>
                                    <strong>Resume Analysis</strong>
                                    <p>Get questions tailored to your resume.</p>
                                </div>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">↗</div>
                                <div>
                                    <strong>Track Your Progress</strong>
                                    <p>Understand your strengths and improve.</p>
                                </div>
                            </div>

                        </div>

                    </div>

                    <div className="auth-footer">
                        © 2026 ENDGAME
                    </div>

                </div>

                {/* RIGHT SIDE */}
                <div className="auth-form-section">
                    {children}
                </div>

            </div>
        </div>
    );
};

export default AuthLayout;