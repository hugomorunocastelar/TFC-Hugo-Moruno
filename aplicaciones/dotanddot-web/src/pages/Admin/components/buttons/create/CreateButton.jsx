import React from 'react';
import './CreateButton.css';

function CreateButton({ onClick, type = 'button' }) {
  return (
    <button className="btn-create" type={type} onClick={onClick}>
      Create
    </button>
  );
}

export default CreateButton;
