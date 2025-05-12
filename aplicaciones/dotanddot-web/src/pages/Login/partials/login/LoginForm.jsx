import React, { useState } from 'react'
import "./LoginForm.css";

function LoginForm() {
  const [formData, setFormData] = useState({ user: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  function sendData() {
    if (!formData.user || !formData.password) {
      setError("All data is obligatory.");
      setTimeout(() => {
        setError("");
      }, 2000)
      return;
    }
    setError("");
    
    setFormData({ user: "", password: "" });

  };

  return (
    <>
      <div className='LoginForm-Inputs'>
        <input
          type="user"
          name="user"
          placeholder='User'
          value={formData.user}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit" className='LoginForm-Button' onClick={sendData}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi bi-send-fill" viewBox="0 0 16 16">
          <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855H.766l-.452.18a.5.5 0 0 0-.082.887l.41.26.001.002 4.995 3.178 3.178 4.995.002.002.26.41a.5.5 0 0 0 .886-.083zm-1.833 1.89L6.637 10.07l-.215-.338a.5.5 0 0 0-.154-.154l-.338-.215 7.494-7.494 1.178-.471z"/>
        </svg>
      </button>
    </>
  );
}

export default LoginForm