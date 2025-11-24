import React, { useState, useEffect } from "react";
import "./ValidateAccount.css";
import { maskEmail } from "../../../../js/secret/email.mjs";
import { useParams } from "react-router-dom";

function ValidateAccount() {
    const { token } = useParams();

    const [code, setCode] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [resendDisabled, setResendDisabled] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const RESEND_COOLDOWN = 30;
    const CODE_MAX_LENGTH = 6;

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
        } else if (countdown === 0) {
            setResendDisabled(false);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleChange = (e) => {
        const val = e.target.value.slice(0, CODE_MAX_LENGTH).toUpperCase();
        setCode(val);
        if (error) setError("");
        if (message) setMessage("");
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (code.length !== CODE_MAX_LENGTH) {
            setError(`El código debe tener ${CODE_MAX_LENGTH} dígitos.`);
            return;
        }
        setError("");
        setMessage("Validando...");
        Promise.resolve(onValidate ? onValidate(code) : null)
            .then(() => setMessage("Código enviado para validación."))
            .catch(() => setError("Error al validar el código."));
    };

    const handleResend = () => {
        setMessage("Reenviando código...");
        Promise.resolve(onResend ? onResend() : null)
            .then(() => {
                setMessage("Código reenviado.");
                setResendDisabled(true);
                setCountdown(RESEND_COOLDOWN);
            })
            .catch(() => setError("No se pudo reenviar el código."));
    };

    return (
        <div className="ValidateAccountPanel-wrapper">
            <div className="ValidateAccountPanel">
                <h2 className="VA-Title">Confirmar email</h2>
                <form className="VA-Form" onSubmit={handleSubmit}>
                    <label htmlFor="validation-code" className="VA-Label">Código enviado a {maskEmail(email, 3, 3)}</label>
                    <input
                        id="validation-code"
                        name="validation-code"
                        type="text"
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        value={code}
                        onChange={handleChange}
                        maxLength={CODE_MAX_LENGTH}
                        placeholder={"_".repeat(CODE_MAX_LENGTH)}
                        className="VA-Input"
                    />
                    {error && <div className="VA-Error">{error}</div>}
                    {message && <div className="VA-Message">{message}</div>}
                    <div className="VA-Actions">
                        <button className="VA-Button" type="submit" disabled={code.length !== CODE_MAX_LENGTH}>
                            Validar
                        </button>
                        <button className="VA-Button VA-Button--secondary" type="button" onClick={handleResend} disabled={resendDisabled}>
                            {resendDisabled ? `Reenviar (${countdown}s)` : "Reenviar código"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ValidateAccount;