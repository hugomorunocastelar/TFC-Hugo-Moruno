import React from "react";
import "./Welcome.css";
import adminImage from "/welcome/welcome.jpeg";

function Welcome() {
  return (
    <div className="welcome-container">
      <img src={adminImage} alt="Dot & Dot Administration" className="welcome-image" />
      <h1>Welcome to the administration panel</h1>
      <p>
        Here you can manage all data from the <strong>Dot & Dot</strong> application for volleyball league management.
      </p>
    </div>
  );
}

export default Welcome;
