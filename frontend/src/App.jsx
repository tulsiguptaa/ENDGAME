import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import Interview from "./pages/auth/Interview";
import ResumeUpload from "./pages/auth/ResumeUpload";
import Profile from "./pages/Profile";

import "./App.css";

function HomeRedirect() {
    const { isAuthenticated, loading } = useAuth();
    if (loading) return null;
    return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* ROOT REDIRECT */}
                    <Route
                        path="/"
                        element={<HomeRedirect />}
                    />

                    {/* PUBLIC AUTH ROUTES */}
                    <Route
                        path="/login"
                        element={<Login />}
                    />

                    <Route
                        path="/signup"
                        element={<Signup />}
                    />

                    <Route
                        path="/forgot-password"
                        element={<ForgotPassword />}
                    />

                    <Route
                        path="/reset-password/:userId/:token"
                        element={<ResetPassword />}
                    />

                    {/* PROTECTED APPLICATION ROUTES */}
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/app"
                            element={<Navigate to="/dashboard" replace />}
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <div className="page-shell">
                                    <Navbar />
                                    <Dashboard />
                                </div>
                            }
                        />

                        <Route
                            path="/resume-upload"
                            element={
                                <div className="page-shell">
                                    <Navbar />
                                    <ResumeUpload />
                                </div>
                            }
                        />

                        <Route
                            path="/interview"
                            element={
                                <div className="page-shell">
                                    <Navbar />
                                    <Interview />
                                </div>
                            }
                        />

                        <Route
                            path="/profile"
                            element={
                                <div className="page-shell">
                                    <Navbar />
                                    <Profile />
                                </div>
                            }
                        />
                    </Route>

                    {/* FALLBACK */}
                    <Route
                        path="*"
                        element={<Navigate to="/" replace />}
                    />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
