import React, { useEffect, useState } from 'react';
import "./OutstandingMatch.css";

function OutstandingMatch() {

  const [OutstandingMatch, setMatch] = useState({});

  useEffect(() => {
    setMatch({
      team1: "Vva",
      team2: "Alc",
      day: "20/05/2025",
      hour: "16:00"
    });
  }, [])

  return (
    <div className='OM-Panel infoPanel'>
      <header className='OM-Head'>
        <h2>Featured</h2>
      </header>
      <main className='OM-Match'>
        <div>
          <h2>{OutstandingMatch.team1} vs {OutstandingMatch.team2}</h2>
          <p>{OutstandingMatch.day} - {OutstandingMatch.hour}</p>
        </div>
      </main>
    </div>
  )
}

export default OutstandingMatch