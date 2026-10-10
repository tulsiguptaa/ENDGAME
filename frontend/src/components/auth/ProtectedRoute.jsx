import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const ProtectedRoute = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "var(--bg-page)",
                    color: "var(--text-primary)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "14px",
                    }}
                >
                    <span
                        className="spinner-inline"
                        style={{
                            width: "24px",
                            height: "24px",
                            borderWidth: "2.5px",
                        }}
                    />
                    <span
                        style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            letterSpacing: "0.2px",
                            color: "var(--text-muted)",
                        }}
                    >
                        Verifying session...
                    </span>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;