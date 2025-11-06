import React from 'react';
import './CancelButton.css';

function CancelButton({ onClick }) {
  return (
    <button className="btn-cancel" onClick={onClick}>
      Cancel
    </button>
  );
}

export default CancelButton;
