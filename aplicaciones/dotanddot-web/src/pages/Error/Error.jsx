import React from "react";
import "./Error.css";

function Error() {
  return (
    <div className="error-container">
      <div className="error-emoji">😵</div>
      <h1 className="error-title">¡Ups! Something gone wrong</h1>
      <p className="error-message">We couldn't find the page you're looking for :(</p>
    </div>
  );
}

export default Error;
