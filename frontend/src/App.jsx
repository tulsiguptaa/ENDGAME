import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Link,
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import Interview from "./pages/Interview";
import ResumeUpload from "./pages/ResumeUpload";

function Dashboard() {
    return (
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <h1
                style={{
                    fontSize: "32px",
                    fontWeight: 800,
                    letterSpacing: "1px",
                }}
            >
                ENDGAME
            </h1>

            <p>You are successfully authenticated.</p>

            <Link to="/resume-upload">
                Go to Resume Studio
            </Link>
        </div>
    );
}

function CareerHeader() {
    return (
        <header className="site-header">
            <Link
                className="brand"
                to="/resume-upload"
                aria-label="CareerCanvas home"
            >
                <span className="brand-mark">C</span>
                <span>CareerCanvas</span>
            </Link>

            <nav className="site-nav" aria-label="Main navigation">
                <Link to="/resume-upload">
                    Resume Studio
                </Link>

                <Link to="/resume-upload#resumes">
                    Your Resumes
                </Link>

                <Link to="/interview">
                    Interview
                </Link>

                <Link to="/dashboard">
                    Dashboard
                </Link>
            </nav>

            <span className="header-note">
                <span className="status-dot" />
                AI-powered career prep
            </span>
        </header>
    );
}

function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    {/* PUBLIC ROUTES */}

                    <Route
                        path="/"
                        element={<Navigate to="/login" replace />}
                    />

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

                    {/* PROTECTED ROUTES */}

                    <Route
                        element={<ProtectedRoute />}
                    >
                        <Route
                            path="/app"
                            element={<Navigate to="/resume-upload" replace />}
                        />

                        <Route
                            path="/dashboard"
                            element={
                                <>
                                    <Navbar />
                                    <Dashboard />
                                </>
                            }
                        />

                        <Route
                            path="/resume-upload"
                            element={
                                <>
                                    <CareerHeader />
                                    <ResumeUpload />
                                </>
                            }
                        />

                        <Route
                            path="/interview"
                            element={
                                <>
                                    <CareerHeader />
                                    <Interview />
                                </>
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

