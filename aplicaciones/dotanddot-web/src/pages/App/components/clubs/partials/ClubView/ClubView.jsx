import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import './ClubView.css';
import { findClub } from '../../../../../../js/cruds/clubs.mjs';

function ClubView() {
  const { id } = useParams();
  const [club, setClub] = useState({});

  useEffect(() => {
    findClub(id)
    .then((response) => {
      setClub(response)
    })
  }, []);

  return (
    <div className="clubview-container">
      <div className="clubview-card">
        <h2 className="clubview-title">{club.name}</h2>
        <div className="clubview-details">
          <p><strong>Ciudad:</strong> {club.idCity?.name}</p>
        </div>
      </div>
    </div>
  );
}

export default ClubView;
