import React from "react";
import "./ForgotPassword.css";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../../../js/auth.mjs";

function ForgotPassword() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    
    const handleChange = (e) => {
        setEmail(e.target.value);
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        setError("");
        try {
            const response = await forgotPassword(email);
            if (response.status === 200) {
                setMessage("Password reset email sent. Please check your inbox.");
            } else {
                setError(response.message || "Failed to send password reset email.");
            }
        } catch (err) {
            setError("Error sending password reset email: " + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="ForgotPasswordPanel-wrapper">
            <div className="ForgotPasswordPanel">
                <h2 className="FP-Title">Forgot Password</h2>
                <form className="FP-Form" onSubmit={handleSubmit}>
                    <label>
                        Enter your email address:
                        <input
                            type="email"
                            value={email}
                            onChange={handleChange}
                            required
                            placeholder="Email"
                        />
                    </label>
                    <button type="submit" className="FP-Button" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Email"}
                    </button>
                </form>
                {message && <p className="FP-Message">{message}</p>}
                {error && <p className="FP-Error">{error}</p>}
                <button className="FP-BackButton" onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
export default ForgotPassword;