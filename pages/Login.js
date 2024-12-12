import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./LoginTheme.css"
// For navigation after login
// Include CSS for styling

const Login = () => {
    const navigate = useNavigate(); // To navigate to the dashboard after successful login
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Input validation
        if (!username || !password) {
            setError("Username and Password are required!");
            setLoading(false);
            return;
        }

        try {
            // Send login request to the API
            const response = await fetch("http://127.0.0.1:8000/api/login/", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ username, password }),
            });
            const data = await response.json();

            if (response.ok) {
                alert("Login successful!");
                // Redirect to dashboard
                navigate('/dashboard');
            } else {
                setError(data.message || "Login failed. Please try again.");
            }
        } catch (error) {
            console.error("Error during login:", error);
            setError("An error occurred during login. Please try again.");
        }

        setLoading(false);
    };

    return (
        <div className="login-container">
            <h2 className="login-title">Login</h2>
            <form className="login-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        required
                    />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;