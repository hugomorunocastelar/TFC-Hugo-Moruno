import React from 'react';
import './NewButton.css';

function NewButton({ onClick, type = 'button' }) {
  return (
    <button className="btn-new" type={type} onClick={onClick}>
      New
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
        <path d="M8 1a.5.5 0 0 1 .5.5V7.5H14a.5.5 0 0 1 0 1H8.5V14a.5.5 0 0 1-1 0V8.5H2a.5.5 0 0 1 0-1h5.5V1.5A.5.5 0 0 1 8 1z"/>
      </svg>
    </button>
  );
}

export default NewButton;
