import React, { useState } from 'react'
import "./LoginForm.css";
import { login } from '../../../../js/AUTH.mjs';
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function sendData() {
    if (!formData.user || !formData.password) {
      setErrorMessage("All data is obligatory.");
    } else {
      login(formData.user, formData.password)
      .then((response) => {
        if(response) {
          navigate('/');
        } else {
          setFormData({ user: "", password: "" });
          setErrorMessage("May your user or password is wrong");
        }
      })
    }
  };

  function setErrorMessage(message) {
    setError(message);
    setTimeout(() => {
      setError("");
    }, 3000)
  }

  return (
    <>
    <div className='LoginForm-Data'>
      <div className='LoginForm-Inputs'>
        <p>Username or Email</p>
        <div>
          <input type="user" name="user" placeholder='Enter your user' value={formData.user} onChange={handleChange} required />
        </div>
        <p>Password</p>
        <div>
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
        </div>
      </div>
      {error && <p className='lp-error'>{error}</p>}
    </div>
    <div className='LoginForm-Button-Panel'>
      <button type="submit" className='LoginForm-Button' onClick={sendData}>
        <p>Login</p>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
        </svg>
      </button>
    </div>
    </>
  );
}

export default LoginForm