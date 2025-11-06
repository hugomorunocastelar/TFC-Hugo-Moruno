import React, { useEffect, useState } from 'react'
import "./NextMatches.css";
import { getAllOpenGames } from '../../../../../../js/home/games.mjs';

function NextMatches() {

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getAllOpenGames()
    .then((response) => {
      if (response) setMatches(response);
    });
  }, []);
  
  return (
    <div className='NexMatches-Panel infoPanel'>
      <div className='NexMatches'>
        <header className='NM-Head'>
          <h2>Next Matches</h2>
        </header>
        <table className='NM-MatchesTable'>
          <tbody>
            {matches ? (matches.filter(p => !p.playing && !p.finished)
            .map((elem, index) => (
              <tr key={index}>
                <td>
                  <p>{`${elem.initialSituation.localTeam.name} vs ${elem.initialSituation.visitTeam.name}`}</p>
                </td>
                <td>
                  <div className='time'>
                    <p>{`${new Date(elem.result.timeStart).getUTCDate()}-${new Date(elem.result.timeStart).getUTCMonth()}-${new Date(elem.result.timeStart).getUTCFullYear()}`}</p>
                    <p>{`${new Date(elem.result.timeStart).getUTCHours()}:${new Date(elem.result.timeStart).getUTCMinutes() == 0 ? '00' : new Date(elem.result.timeStart).getUTCMinutes()}`}</p>
                  </div>
                </td>
              </tr>
            ))) : (
              <tr>
                <td>
                  <p>Empty data...</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default NextMatches