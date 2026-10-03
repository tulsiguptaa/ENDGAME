import React from "react";

import {
    Navigate,
    Outlet
} from "react-router-dom";

import {
    useAuth
} from "../../context/AuthContext";


const ProtectedRoute = () => {

    const {
        isAuthenticated,
        loading
    } = useAuth();


    if (loading) {

        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#08090d",
                    color: "white"
                }}
            >
                Checking authentication...
            </div>
        );

    }


    if (!isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );

    }


    return <Outlet />;
};


export default ProtectedRoute;