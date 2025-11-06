import React from 'react';
import './UpdateButton.css';

function UpdateButton({ onClick }) {
  return (
    <button className="btn-update" onClick={onClick}>
      Update
    </button>
  );
}

export default UpdateButton;
