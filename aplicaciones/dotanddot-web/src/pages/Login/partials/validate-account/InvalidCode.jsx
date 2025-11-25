import React from "react";
import { useNavigate } from "react-router-dom";
import "./ValidateAccount.css";

function InvalidCode({ error }) {
    const navigate = useNavigate();

    return (
        <div className="ValidateAccountPanel-wrapper">
            <div className="ValidateAccountPanel">
                <h2 className="VA-Title">Invalid Code</h2>
                <p style={{ textAlign: "center", color: "var(--color-palette-red-3)", marginBottom: "20px", fontSize: "16px" }}>
                    {error || "The validation code is invalid or has expired."}
                </p>
                <div style={{ display: "flex", gap: "10px", justifyContent: "center", marginTop: "20px" }}>
                    <button 
                        className="VA-Button" 
                        onClick={() => navigate('/login')}
                        style={{ padding: "10px 20px" }}
                    >
                        Back to Login
                    </button>
                    <button 
                        className="VA-Button VA-Button--secondary" 
                        onClick={() => navigate('/')}
                        style={{ padding: "10px 20px" }}
                    >
                        Go to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default InvalidCode;
