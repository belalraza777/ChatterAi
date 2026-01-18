import React, { useState } from "react";
import { login } from "../../api/userApi.js";  // Import the API function
import { useNavigate, Link } from "react-router-dom";
import "./login.css";

export default function Login() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    // Error state
    const [error, setError] = useState("");
    //loader
    const [isLoading, setIsLoading] = useState(false);


    // Handle input changes
    function handleChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => {
            return { ...prev, [name]: value }
        });
    }

    // Handle form submit
    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setIsLoading(true);
        try {
            // Call backend signup API
            await login(formData.email, formData.password);
            // Redirect to chat page after successful signup
            navigate("/chat");
        } catch (err) {
            console.error("Login error:", err);
            // Show error message from backend or generic error
            const message =
                err?.response?.data?.error ||
                err.message ||
                "Login failed, please try again.";
            setError(message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome to <span>ChatterAI</span></h1>
                    <p>Sign in to continue your conversations</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Sign In"
                        )}
                    </button>

                    <div className="login-footer">
                        <span>New to ChatterAI? </span>
                        <Link to="/signup">Create account</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
