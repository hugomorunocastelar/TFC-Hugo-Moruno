import React from 'react';
import { useParams } from 'react-router-dom';
import { useSSE } from '../../../../hooks/useSSE';
import API from '../../../../js/env';
import './LiveGameView.css';

function LiveGameView() {
  const { uniqueCode } = useParams();
  const { data: game, connected, error } = useSSE(API.MATCHES.LIVE(uniqueCode));

  if (error) {
    return (
      <div className="live-game-error">
        <p>Error connecting to live game: {error}</p>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="live-game-loading">
        <div className="loader"></div>
        <p>Connecting to live game...</p>
      </div>
    );
  }

  const localTeam = game.initialSituation?.localTeam;
  const visitTeam = game.initialSituation?.visitTeam;
  const currentSet = game.sets?.find(s => !s.timeEnd) || game.sets?.[game.sets.length - 1];

  return (
    <div className="live-game-view">
      <div className="live-indicator">
        <span className="live-dot"></span>
        LIVE
        {!connected && <span className="reconnecting"> (reconnecting...)</span>}
      </div>

      <div className="game-header">
        <div className="league-info">
          {game.league?.name}
        </div>
        <div className="game-code">
          {game.uniqueCode}
        </div>
      </div>

      <div className="scoreboard">
        <div className="team local">
          <div className="team-name">{localTeam?.name || 'Local'}</div>
          <div className="team-score">{currentSet?.pointsLocal || 0}</div>
        </div>

        <div className="separator">
          <div className="vs">VS</div>
          {currentSet && (
            <div className="current-set">Set {currentSet.setNumber}</div>
          )}
        </div>

        <div className="team visit">
          <div className="team-score">{currentSet?.pointsVisit || 0}</div>
          <div className="team-name">{visitTeam?.name || 'Visitor'}</div>
        </div>
      </div>

      <div className="sets-overview">
        <h3>Sets</h3>
        <div className="sets-list">
          {game.sets?.map((set) => (
            <div 
              key={set.id} 
              className={`set-item ${!set.timeEnd ? 'active' : 'finished'}`}
            >
              <div className="set-header">Set {set.setNumber}</div>
              <div className="set-score">
                <span className="local">{set.pointsLocal}</span>
                <span className="separator">-</span>
                <span className="visit">{set.pointsVisit}</span>
              </div>
              {set.timeEnd && <div className="set-status">✓</div>}
            </div>
          ))}
        </div>
      </div>

      {game.sanctionsList && game.sanctionsList.length > 0 && (
        <div className="sanctions-section">
          <h3>Sanctions</h3>
          <div className="sanctions-timeline">
            {game.sanctionsList.map((sanction, idx) => (
              <div key={idx} className={`sanction ${sanction.type.toLowerCase()}`}>
                <div className="sanction-card">
                  <span className="sanction-icon">
                    {sanction.type === 'YELLOW' ? '🟨' : '🟥'}
                  </span>
                  <span className="sanction-team">{sanction.team?.name}</span>
                  <span className="sanction-moment">{sanction.marcador}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {game.finished && (
        <div className="game-finished">
          <h2>🏁 Game Finished</h2>
          {game.result && (
            <div className="final-result">
              <div className="result-score">
                {game.result.setsLocal} - {game.result.setsVisit}
              </div>
              <div className="winner">
                Winner: {game.result.winner?.name || 'TBD'}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default LiveGameView;
