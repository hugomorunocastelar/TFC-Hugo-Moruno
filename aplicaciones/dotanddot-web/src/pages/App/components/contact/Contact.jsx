import React from 'react';
import './Contact.css';

function Contact() {
  return (
    <div className="form-wrapper">
      <form className="contact-form">
        <h2>Contacto</h2>
        <input type="text" placeholder="Nombre" required />
        <input type="email" placeholder="Correo" required />
        <textarea placeholder="Mensaje" required></textarea>
        <button type="submit">Enviar</button>
      </form>
    </div>
  )
}

export default Contact