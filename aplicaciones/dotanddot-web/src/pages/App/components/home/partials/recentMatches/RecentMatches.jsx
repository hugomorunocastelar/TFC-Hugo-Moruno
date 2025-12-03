import React from 'react'
import { useNavigate } from 'react-router-dom';
import "./RecentMatches.css";
import FavoriteButton from '../../../../../../components/FavoriteButton/FavoriteButton';

function RecentMatches({matches}) {
  const navigate = useNavigate();

  return (
    <div className='RecMatches-Panel infoPanel'>
      <div className='RecMatches'>
        <header className='RM-Head'>
          <h2>Recent Matches</h2>
        </header>
        <table className='RM-MatchesTable'>
          <tbody>
            {matches ? (matches.filter(p => !p.playing && p.finished)
            .slice(0, 5)
            .map((elem) => (
              <tr key={elem.id} onClick={() => navigate(`/game/${elem.id}`)} className="clickable-row">
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
                    <p>{`${new Date(elem.result.timeStart).getUTCHours()}:${new Date(elem.result.timeStart).getUTCMinutes() == 0 ? '00' : new Date(elem.result.timeStart).getUTCMinutes()}`}</p>
                    <p>{`${new Date(elem.result.timeStart).getUTCDate()}-${new Date(elem.result.timeStart).getUTCMonth()}-${new Date(elem.result.timeStart).getUTCFullYear()}`}</p>
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

export default RecentMatches