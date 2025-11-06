import React, { useEffect, useState } from 'react'
import "./RecentMatches.css";
import { getAllOpenGames } from '../../../../../../js/home/games.mjs';

function RecentMatches() {

  const [matches, setMatches] = useState([]);

  useEffect(() => {
    getAllOpenGames()
    .then((response) => {
      if (response) setMatches(response);
    });
  }, []);
  
  return (
    <div className='RecMatches-Panel infoPanel'>
      <div className='RecMatches'>
        <header className='RM-Head'>
          <h2>Recent Matches</h2>
        </header>
        <table className='RM-MatchesTable'>
          <tbody>
            {matches ? (matches.filter(p => !p.playing && p.finished)
            .map((elem) => (
              <tr key={elem.id}>
                <td>
                  <div className='teams'>
                    <p>{elem.initialSituation.localTeam.name}</p>
                    <p>{elem.initialSituation.visitTeam.name}</p>
                  </div>
                </td>
                <td>
                  <div className='teams'>
                    <p>{elem.result.pointsLocal}</p>
                    <p>{elem.result.pointsVisit}</p>
                  </div>
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

export default RecentMatches