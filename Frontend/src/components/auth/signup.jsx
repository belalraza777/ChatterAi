import React, { useState } from "react";
import { signup } from "../../api/userApi.js";  // Import the API function
import { useNavigate, Link } from "react-router-dom";
import "./signup.css";

export default function Signup() {
    const navigate = useNavigate();

    // Form state
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Error and loader state
    const [error, setError] = useState("");
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
            await signup(formData.username, formData.email, formData.password);
            // Redirect to chat page after successful signup
            navigate("/chat");
        } catch (err) {
            console.error("Signup error:", err);
            // Show error message from backend or generic error
            const message =
                err?.response?.data?.error ||
                err.message ||
                "Signup failed, please try again.";
            setError(message);
        }finally {
            setIsLoading(false);
        }
    }

    return  (
        <div className="signup-container">
            <div className="signup-card">
                <div className="signup-header">
                    <h1>Join <span>ChatterAI</span></h1>
                    <p>Create your account to get started</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            autoFocus
                            placeholder="Choose a username"
                            minLength={3}
                            maxLength={30}
                        />
                    </div>

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
                            minLength={6}
                            placeholder="At least 6 characters"
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <button type="submit" disabled={isLoading}>
                        {isLoading ? (
                            <span className="spinner"></span>
                        ) : (
                            "Create Account"
                        )}
                    </button>

                    <div className="signup-footer">
                        <span>Already have an account? </span>
                        <Link to="/login">Sign in</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}
