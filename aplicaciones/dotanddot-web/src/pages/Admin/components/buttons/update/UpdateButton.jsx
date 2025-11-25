import React from 'react';
import './UpdateButton.css';

function UpdateButton({ onClick, type = 'button' }) {
  return (
    <button className="btn-update" type={type} onClick={onClick}>
      Update
    </button>
  );
}

export default UpdateButton;
