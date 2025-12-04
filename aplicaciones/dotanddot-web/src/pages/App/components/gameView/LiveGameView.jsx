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
  const setsArray = [game.set1, game.set2, game.set3, game.set4, game.set5].filter(Boolean);
  const currentSet = setsArray.find(s => !s.timeEnd) || setsArray[setsArray.length - 1];

  
  const getSetsWon = () => {
    let localSets = 0;
    let visitSets = 0;
    setsArray.forEach(set => {
      if (set.timeEnd) {
        if (set.pointsLocal > set.pointsVisit) localSets++;
        else if (set.pointsVisit > set.pointsLocal) visitSets++;
      }
    });
    return { localSets, visitSets };
  };

  const { localSets, visitSets } = getSetsWon();

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

      <div className="game-display">
        <div className="teams-header">
          <div className="team-info local">
            <div className="team-name">{localTeam?.name || 'Local'}</div>
            <div className="team-club">{localTeam?.idClub?.name}</div>
          </div>
          <div className="center-info">
            {currentSet && (
              <div className="current-set-badge">Set {currentSet.setNumber}</div>
            )}
          </div>
          <div className="team-info visit">
            <div className="team-name">{visitTeam?.name || 'Visitor'}</div>
            <div className="team-club">{visitTeam?.idClub?.name}</div>
          </div>
        </div>

        <div className="score-section">
          <div className="sets-won">
            <div className="sets-won-value local">{localSets}</div>
            <div className="sets-won-label">SETS</div>
            <div className="sets-won-value visit">{visitSets}</div>
          </div>

          <div className="current-score">
            <div className="score-value local">{currentSet?.pointsLocal || 0}</div>
            <div className="score-separator">-</div>
            <div className="score-value visit">{currentSet?.pointsVisit || 0}</div>
          </div>
        </div>

        <div className="sets-grid">
          {setsArray.map((set) => (
            <div 
              key={set.id} 
              className={`set-column ${!set.timeEnd ? 'active' : 'finished'}`}
            >
              <div className="set-label">Set {set.setNumber}</div>
              <div className="set-points">
                <span className="points-local">{set.pointsLocal}</span>
                <span className="points-separator">-</span>
                <span className="points-visit">{set.pointsVisit}</span>
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
