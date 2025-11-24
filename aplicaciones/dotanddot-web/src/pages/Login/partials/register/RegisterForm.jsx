import React, { useState } from 'react'
import './RegisterForm.css';
import { useNavigate } from 'react-router-dom';
import { register } from '../../../../js/AUTH.mjs';

function RegisterForm() {

  const [formData, setFormData] = useState({ username: "", email: "", password: "", passwordRepeat: "", lopd: false });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [showRepeated, setShowRepeated] = useState(false);
  const [lopdAccepted, setLopdAccepted] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLopdChange = (e) => {
    console.log(e.target.checked);
    console.log(lopdAccepted);
    const { checked } = e.target;
    setLopdAccepted(checked);
    setFormData((prev) => ({ ...prev, lopd: checked }));
  };

  const validateData = () => {
    if (!formData.username || !formData.email || !formData.password || !formData.passwordRepeat) {
      setErrorMessage("All fields are required.");
      return false;
    }

    if (formData.username.length < 3) {
      setErrorMessage("Username must be at least 3 characters.");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }

    if (formData.password.length < 8) {
      setErrorMessage("Password must be at least 8 characters.");
      return false;
    }

    if (formData.password !== formData.passwordRepeat) {
      setErrorMessage("Passwords do not match.");
      return false;
    }

    if (!formData.lopd) {
      setErrorMessage("You must accept the privacy policy.");
      return false;
    }

    return true;
  };

  function sendData() {
    if (validateData()) {
      register(formData)
        .then((response) => {
        if (response) {
          navigate('/validate-account');
        } else {
          setFormData({ username: "", email: "", password: "", passwordRepeat: "", lopd: false });
          setErrorMessage("Registration failed. Please check your data.");
        }
        })
        .catch(() => {
          setErrorMessage("Network or server error.");
        });
    }
  };

  function setErrorMessage(message) {
    setError(message);
    console.log(message);
    setTimeout(() => {
      setError("");
    }, 3000)
  }

  return (
    <div>
      <div className='RegisterForm-Data'>
        <div className='RegisterForm-Inputs'>
          <label>
            Username
            <input type="username" name="username" placeholder='Enter your username' value={formData.username} onChange={handleChange} required />
          </label>
          <label>
            Email
            <input type="email" name="email" placeholder='Enter your email' value={formData.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type={show ? "text" : "password"} name="password" placeholder="Enter your password" value={formData.password} onChange={handleChange} required />
            <button type="button" onClick={() => setShow(!show)} className="passwordShower" >
              {show ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
              )}
            </button>
          </label>
          <label>
            Repeat Pass.
            <input type={showRepeated ? "text" : "password"} name="passwordRepeat" placeholder="Repeat your password" value={formData.passwordRepeat} onChange={handleChange} required />
            <button type="button" onClick={() => setShowRepeated(!showRepeated)} className="passwordShower" >
              {showRepeated ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-slash-fill" viewBox="0 0 16 16">
                  <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7 7 0 0 0 2.79-.588M5.21 3.088A7 7 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474z"/>
                  <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-eye-fill" viewBox="0 0 16 16">
                  <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"/>
                  <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8m8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7"/>
                </svg>
              )}
            </button>
          </label>
          <label className='dataPolicy'>
            <input type="checkbox" name="lopd" value={lopdAccepted} onClick={handleLopdChange} required/>
            <span>
              I have read and accept the
              <a href="/privacy-policy" className='privacyPolicyUrl'> Privacy Policy </a>
              and I consent to the processing of my personal data by Dot&Dot
              for the purpose of managing my registration and access to the platform.
            </span>
          </label>
        </div>
        {error && <p className='lp-error'>{error}</p>}
      </div>
      <div className='RegisterForm-Button-Panel'>
        <button type="submit" className='RegisterForm-Button' onClick={sendData}>
          <p>Register</p>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
            <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
          </svg>
        </button>
      </div>
    </div>
  )
}

export default RegisterForm