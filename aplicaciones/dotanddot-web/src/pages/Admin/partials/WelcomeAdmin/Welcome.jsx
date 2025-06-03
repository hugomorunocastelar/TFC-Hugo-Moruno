import React from "react";
import "./Welcome.css";
import adminImage from "/welcome/welcome.jpeg";

function Welcome() {
  return (
    <div className="welcome-container">
      <img src={adminImage} alt="Administración Dot & Dot" className="welcome-image" />
      <h1>Bienvenido/a al panel de administración</h1>
      <p>
        Aquí puedes gestionar todos los datos de la aplicación <strong>Dot & Dot</strong> para el control de ligas de voleibol.
      </p>
    </div>
  );
}

export default Welcome;
