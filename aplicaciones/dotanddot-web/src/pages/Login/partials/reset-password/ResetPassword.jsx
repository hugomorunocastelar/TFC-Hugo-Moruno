import React, { useEffect } from "react";
import "./ResetPassword.css";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../../../js/auth.mjs";

function ResetPassword() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    
    const [password, setPassword] = React.useState("");
    const [passwordRepeat, setPasswordRepeat] = React.useState("");
    const [message, setMessage] = React.useState("");
    const [error, setError] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    useEffect(() => {
        if (!token) {
            navigate('/login');
        }
    }, [token, navigate]);

    const handleChangePassword = (e) => { setPassword(e.target.value); }
    const handleChangePasswordRepeat = (e) => { setPasswordRepeat(e.target.value); }

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (password !== passwordRepeat) {
            setError("Passwords do not match.");
            return;
        }
        
        setLoading(true);  
        setMessage("");
        setError("");
        try {
            const response = await resetPassword(token, password, passwordRepeat);
            if (response.status === 200) {
                setMessage("Password has been reset successfully. You can now log in with your new password.");
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(response.message || "Failed to reset password.");
            }   
        } catch (err) {
            setError("Error resetting password: " + err.message);
        }
        setLoading(false);
    }
    return (
        <div className="ResetPasswordPanel-wrapper">
            <div className="ResetPasswordPanel">
                <h2 className="RP-Title">Reset Password</h2>
                <form className="RP-Form" onSubmit={handleSubmit}>
                    <label>
                        New Password:
                        <input
                            type="password"
                            value={password}
                            onChange={handleChangePassword}
                            required
                            placeholder="New Password"
                        />
                    </label>
                    <label>
                        Repeat New Password:
                        <input
                            type="password"
                            value={passwordRepeat}
                            onChange={handleChangePasswordRepeat}
                            required
                            placeholder="Repeat New Password"
                        />
                    </label>
                    <button type="submit" className="RP-Button" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                </form> 
                {message && <p className="RP-Message">{message}</p>}
                {error && <p className="RP-Error">{error}</p>}
                <button className="RP-BackButton" onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
export default ResetPassword;