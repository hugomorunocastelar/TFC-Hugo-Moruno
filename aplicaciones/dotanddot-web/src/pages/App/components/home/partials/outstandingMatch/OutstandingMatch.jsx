import React, { useEffect, useState } from 'react';
import "./OutstandingMatch.css";
import { getOutstandingMatch } from '../../../../../../js/home/games.mjs';

function OutstandingMatch() {

  const [match, setMatch] = useState();

  useEffect(() => {
    getOutstandingMatch()
    .then((response) => {
      if (response) setMatch(response);
    })
  }, [])

  return (
    <div className='OM-Panel infoPanel'>
      <header className='OM-Head'>
        <h2>Featured</h2>
      </header>
      <main className='OM-Match'>
        {match ?
        (<div>
          <h2>{match.initialSituation.localTeam.name} vs {match.initialSituation.visitTeam.name}</h2>
          <p>{`${new Date(match.result.timeStart).getUTCDate()}-${new Date(match.result.timeStart).getUTCMonth()}-${new Date(match.result.timeStart).getUTCFullYear()}`} - {`${new Date(match.result.timeStart).getUTCHours()}:${new Date(match.result.timeStart).getUTCMinutes() == 0 ? '00' : new Date(match.result.timeStart).getUTCMinutes()}`}</p>
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