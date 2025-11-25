import React, { useState, useEffect } from "react";
import "./ValidateAccount.css";
import { useParams, useNavigate } from "react-router-dom";
import InvalidCode from "./InvalidCode";
import { verifyAccount } from "../../../../js/auth.mjs";

function ValidateAccount() {
    const { token } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [isValid, setIsValid] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!token) {
            setError("Code not found in URL");
            setIsValid(false);
            setLoading(false);
            return;
        }

        const validateCodeFromUrl = async () => {
            try {
                const response = await verifyAccount(token);
                console.log("ValidateAccount response:", response);

                if (response.status === 200) {
                    setIsValid(true);
                    setTimeout(() => navigate('/'), 2000);
                } else {
                    setIsValid(false);
                    setError(response.message || "The code is invalid or has expired");
                }
            } catch (err) {
                setIsValid(false);
                setError("Error validating code: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        validateCodeFromUrl();
    }, [token, navigate]);

    if (loading) {
        return (
            <div className="ValidateAccountPanel-wrapper">
                <div className="ValidateAccountPanel">
                    <h2 className="VA-Title">Validating code...</h2>
                    <p style={{ textAlign: "center", color: "var(--color-palette-blue-2)" }}>Please wait a moment</p>
                </div>
            </div>
        );
    }

    if (!isValid) {
        return <InvalidCode error={error} />;
    }

    return (
        <div className="ValidateAccountPanel-wrapper">
            <div className="ValidateAccountPanel">
                <h2 className="VA-Title">Email confirmed!</h2>
                <p style={{ textAlign: "center", color: "var(--color-palette-green-3)", marginBottom: "20px" }}>
                    Your email has been successfully validated.
                </p>
                <p style={{ textAlign: "center", color: "var(--color-palette-blue-2)", fontSize: "14px" }}>
                    You will be redirected to the home page...
                </p>
            </div>
        </div>
    );
}

export default ValidateAccount;