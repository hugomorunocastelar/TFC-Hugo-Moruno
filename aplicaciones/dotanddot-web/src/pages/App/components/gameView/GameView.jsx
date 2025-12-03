import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getGameById } from '../../../../js/home/games.mjs';
import './GameView.css';
import Loader from '../../../Loader/Loader';

function GameView() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const data = await getGameById(gameId);
        setGame(data);
      } catch (error) {
        console.error('Error fetching game:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  if (loading) return <Loader />;
  if (!game) return <div className="gameview-error">Game not found</div>;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCFullYear()}`;
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
  };

  const getDuration = (start, end) => {
    if (!start || !end) return null;
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diff = Math.floor((endDate - startDate) / 60000); 
    return `${diff} min`;
  };

  return (
    <div className="gameview-container">
      <button className="gameview-back" onClick={() => navigate(-1)}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
          <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
        </svg>
        Back
      </button>

      <div className="gameview-card">
        <div className="gameview-header">
          <div className="gameview-status">
            {game.finished ? (
              <span className="status-badge finished">Finished</span>
            ) : game.playing ? (
              <span className="status-badge playing">Playing</span>
            ) : (
              <span className="status-badge upcoming">Upcoming</span>
            )}
          </div>
          <div className="gameview-code">{game.uniqueCode}</div>
        </div>

        <div className="gameview-teams">
          <div className="team local">
            <div className="team-info">
              <h2>{game.initialSituation.localTeam.name}</h2>
              <p className="team-club">{game.initialSituation.localTeam.idClub.name}</p>
              <p className="team-city">{game.initialSituation.localTeam.idClub.idCity.name}</p>
            </div>
            {game.result && (
              <div className="team-score">{game.result.setsWonLocal}</div>
            )}
          </div>

          <div className="vs-divider">
            <span>VS</span>
          </div>

          <div className="team visit">
            {game.result && (
              <div className="team-score">{game.result.setsWonVisit}</div>
            )}
            <div className="team-info">
              <h2>{game.initialSituation.visitTeam.name}</h2>
              <p className="team-club">{game.initialSituation.visitTeam.idClub.name}</p>
              <p className="team-city">{game.initialSituation.visitTeam.idClub.idCity.name}</p>
            </div>
          </div>
        </div>

        {game.result && game.result.winnerTeam && (
          <div className="gameview-winner">
            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
              <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935"/>
            </svg>
            Winner: {game.result.winnerTeam.name}
          </div>
        )}

        {}
        {game.result && (game.set1 || game.set2 || game.set3) && (
          <div className="gameview-sets">
            <h3>Sets</h3>
            <div className="sets-grid">
              {[game.set1, game.set2, game.set3, game.set4, game.set5].map((set, index) => 
                set ? (
                  <div key={index} className="set-card">
                    <div className="set-header">Set {index + 1}</div>
                    <div className="set-score">
                      <span className={set.pointsLocal > set.pointsVisit ? 'score-winner' : ''}>
                        {set.pointsLocal}
                      </span>
                      <span className="score-separator">-</span>
                      <span className={set.pointsVisit > set.pointsLocal ? 'score-winner' : ''}>
                        {set.pointsVisit}
                      </span>
                    </div>
                    {set.timeStart && set.timeEnd && (
                      <div className="set-time">
                        {formatTime(set.timeStart)} - {formatTime(set.timeEnd)}
                      </div>
                    )}
                  </div>
                ) : null
              )}
            </div>
            <div className="total-points">
              <div className="total-label">Total Points:</div>
              <div className="total-score">
                <span>{game.result.pointsLocal}</span>
                <span className="score-separator">-</span>
                <span>{game.result.pointsVisit}</span>
              </div>
            </div>
          </div>
        )}

        <div className="gameview-details-grid">
          <div className="detail-section">
            <h3>Game Details</h3>
            <div className="detail-item">
              <span className="detail-label">Competition:</span>
              <span className="detail-value">{game.details.competition.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">League:</span>
              <span className="detail-value">{game.league.name}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Category:</span>
              <span className="detail-value">{game.details.category}</span>
            </div>
            {game.details.division && (
              <div className="detail-item">
                <span className="detail-label">Division:</span>
                <span className="detail-value">{game.details.division}</span>
              </div>
            )}
            <div className="detail-item">
              <span className="detail-label">Location:</span>
              <span className="detail-value">{game.details.city.name}</span>
            </div>
          </div>

          <div className="detail-section">
            <h3>Schedule</h3>
            <div className="detail-item">
              <span className="detail-label">Date:</span>
              <span className="detail-value">{formatDate(game.details.date)}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Start Time:</span>
              <span className="detail-value">{formatTime(game.details.timeStart)}</span>
            </div>
            {game.result && game.result.timeEnd && (
              <>
                <div className="detail-item">
                  <span className="detail-label">End Time:</span>
                  <span className="detail-value">{formatTime(game.result.timeEnd)}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Duration:</span>
                  <span className="detail-value">{getDuration(game.result.timeStart, game.result.timeEnd)}</span>
                </div>
              </>
            )}
          </div>

          <div className="detail-section">
            <h3>Initial Situation</h3>
            {game.initialSituation?.startingTeam && (
              <div className="detail-item">
                <span className="detail-label">Starting Team:</span>
                <span className="detail-value">{game.initialSituation.startingTeam.name}</span>
              </div>
            )}
            {game.initialSituation?.leftTeam && (
              <div className="detail-item">
                <span className="detail-label">Left Side:</span>
                <span className="detail-value">{game.initialSituation.leftTeam.name}</span>
              </div>
            )}
          </div>

          <div className="detail-section">
            <h3>Teams Info</h3>
            <div className="detail-item">
              <span className="detail-label">Local Captain:</span>
              <span className="detail-value">
                {game.initialSituation.localTeam.dniCaptain.name} {game.initialSituation.localTeam.dniCaptain.surnames}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Visit Captain:</span>
              <span className="detail-value">
                {game.initialSituation.visitTeam.dniCaptain.name} {game.initialSituation.visitTeam.dniCaptain.surnames}
              </span>
            </div>
          </div>
        </div>

        {game.finished && (
          <div className="gameview-relevance">
            <div className="relevance-stars">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  xmlns="http://www.w3.org/2000/svg"
                  fill={i < game.relevance ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 16 16"
                  className={i < game.relevance ? 'star-filled' : 'star-empty'}
                >
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
              ))}
            </div>
            <span className="relevance-label">Match Relevance</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameView;
