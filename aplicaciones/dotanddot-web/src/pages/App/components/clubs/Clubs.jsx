import React, { useEffect, useState } from 'react'
import ExtremaduraMap from './partials/ExtremaduraMap.jsx';
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
    .catch(error => console.error('Error fetching clubs:', error));
  }, []);

  return (
    <div>
      <ExtremaduraMap clubs={clubs} />
    </div>
  )
}

export default Clubs