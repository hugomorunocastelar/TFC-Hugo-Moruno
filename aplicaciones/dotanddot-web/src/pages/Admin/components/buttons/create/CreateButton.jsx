import React from 'react';
import './CreateButton.css';

function CreateButton({ onClick }) {
  return (
    <button className="btn-create" onClick={onClick}>
      Create
    </button>
  );
}

export default CreateButton;
