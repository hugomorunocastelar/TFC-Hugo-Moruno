import React from 'react'
import { useNavigate } from 'react-router-dom'
import "./SRE.css";

function SRE() {
  const navigate = useNavigate()

  return (
    <div className="error-container">
      <div className="error-emoji">😵‍💫</div>
      <h1 className="error-title">¡Ups! We think you're using a phone 🤨</h1>
      <p className="error-message">Seems that your resolution is smaller than needed.</p>
      <button className="error-button" onClick={() => {navigate('/')}}>Go back</button>
    </div>
  )
}

export default SRE