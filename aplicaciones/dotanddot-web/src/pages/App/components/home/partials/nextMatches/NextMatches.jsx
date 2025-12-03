import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./NextMatches.css";
import FavoriteButton from '../../../../../../components/FavoriteButton/FavoriteButton';

function NextMatches({matches}) {
  const navigate = useNavigate();

  return (
    <div className='NexMatches-Panel infoPanel'>
      <div className='NexMatches'>
        <header className='NM-Head'>
          <h2>Next Matches</h2>
        </header>
        <table className='NM-MatchesTable'>
          <tbody>
            {matches ? (matches.filter(p => !p.playing && !p.finished)
            .slice(0, 5)
            .map((elem, index) => (
              <tr key={index} onClick={() => navigate(`/game/${elem.id}`)} className="clickable-row">
                <td>
                  <p>{`${elem.initialSituation.localTeam.name} vs ${elem.initialSituation.visitTeam.name}`}</p>
                </td>
                <td>
                  <div className='time'>
                    <p>{`${new Date(elem.details.timeStart).getUTCHours()}:${new Date(elem.details.timeStart).getUTCMinutes() == 0 ? '00' : new Date(elem.details.timeStart).getUTCMinutes()}`}</p>
                    <p>{`${new Date(elem.details.timeStart).getUTCDate()}-${new Date(elem.details.timeStart).getUTCMonth()}-${new Date(elem.details.timeStart).getUTCFullYear()}`}</p>
                  </div>
                </td>
                <td>
                  <FavoriteButton gameId={elem.id} size="small" />
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