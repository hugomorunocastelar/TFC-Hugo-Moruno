import React from 'react';
import './CancelButton.css';

function CancelButton({ onClick, type = 'button' }) {
  return (
    <button className="btn-cancel" type={type} onClick={onClick}>
      Cancel
    </button>
  );
}

export default CancelButton;
