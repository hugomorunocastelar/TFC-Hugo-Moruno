import React from "react";
import "./WelcomeReferee.css";
import refereeImage from "/welcome/referees.jpg";

function WelcomeReferee() {
  return (
    <div className="welcome-container">
      <img src={refereeImage} alt="Dot & Dot Referee" className="welcome-image" />
      <h1>Welcome to the referee panel</h1>
      <p>
        Here you can manage your assignments, matches, and keep track of all your referee <br/>activities in the <strong>Dot & Dot</strong> application for volleyball league management.
      </p>
    </div>
  );
}

export default WelcomeReferee;
