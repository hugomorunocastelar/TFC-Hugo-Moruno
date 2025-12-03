import React from 'react';
import { useNavigate } from 'react-router-dom';
import "./OutstandingMatch.css";

function OutstandingMatch({match}) {
  const navigate = useNavigate();

  return (
    <div className='OM-Panel infoPanel'>
      <header className='OM-Head'>
        <h2>Featured</h2>
      </header>
      <main className='OM-Match'>
        {match ?
        (<div onClick={() => navigate(`/game/${match.id}`)} className="clickable-content">
          <h2>{match.initialSituation.localTeam.name}</h2>
          <h2>vs</h2>
          <h2>{match.initialSituation.visitTeam.name}</h2>
          <p>{`${new Date(match.details.timeStart).getUTCDate()}-${new Date(match.details.timeStart).getUTCMonth()}-${new Date(match.details.timeStart).getUTCFullYear()}`} - {`${new Date(match.details.timeStart).getUTCHours()}:${new Date(match.details.timeStart).getUTCMinutes() == 0 ? '00' : new Date(match.details.timeStart).getUTCMinutes()}`}</p>
        </div>) : (
          <div>
            <p>No data...</p>
          </div>
        )}
      </main>
    </div>
  )
}

export default OutstandingMatch