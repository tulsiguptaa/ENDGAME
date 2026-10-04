import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/Navbar";

import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";


function Dashboard() {

    return (
        <div style={{ paddingTop: "80px", textAlign: "center" }}>
            <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "1px" }}>
                ENDGAME
            </h1>
            <p>You are successfully authenticated.</p>
        </div>
    );
}


function App() {

    return (

        <ThemeProvider>

            <BrowserRouter>

                <Navbar />

                <Routes>

                    {/* PUBLIC */}

                    <Route
                        path="/"
                        element={
                            <Navigate
                                to="/login"
                                replace
                            />
                        }
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

                    {/* PROTECTED */}

                    <Route element={<ProtectedRoute />}>

                        <Route
                            path="/dashboard"
                            element={<Dashboard />}
                        />

                    </Route>

                </Routes>

            </BrowserRouter>

        </ThemeProvider>
    );
}

export default App;