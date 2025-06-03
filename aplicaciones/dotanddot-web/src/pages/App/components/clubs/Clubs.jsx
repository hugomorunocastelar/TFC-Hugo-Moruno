import React, { useEffect, useState } from 'react'
import "./Clubs.css";
import ClubsTable from './partials/ClubsTable';
import { getPublic } from '../../../../js/http';
import API from '../../../../js/env';

function Clubs() {

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    getPublic(API.OPEN.CLUBS.ALL)
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Clubs petition failed');
      }
      return response.json();
    }).then((data) => {
      setClubs(data);
    })
  }, []);

  return (
    <div>
      <ClubsTable clubs={clubs} />
    </div>
  )
}

export default Clubs