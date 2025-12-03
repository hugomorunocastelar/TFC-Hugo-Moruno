import React from 'react';
import { useParams } from 'react-router-dom';
import { useGameSSE } from '../../../js/hooks/useGameSSE';
import './LiveGameView.css';
import Loader from '../../../components/Loader/Loader';

function LiveGameView() {
    const { uniqueCode } = useParams();

    const handleGameUpdate = (update) => {
        console.log('Game updated:', update.type, update.message);
    };

    const { connected, error, game } = useGameSSE(uniqueCode, handleGameUpdate);

    if (!game) {
        return <Loader />;
    }

    const getActiveSet = () => {
        if (!game.sets || game.sets.length === 0) return null;
        return game.sets.find(s => !s.timeEnd) || game.sets[game.sets.length - 1];
    };

    const activeSet = getActiveSet();

    return (
        <div className="live-game-view">
            <header className="live-view-header">
                <div className={`live-indicator ${connected ? 'live' : 'offline'}`}>
                    {connected ? '🔴 LIVE' : '⚫ OFFLINE'}
                </div>
                <h1>Live Game</h1>
            </header>

            {error && (
                <div className="alert alert-error">
                    {error}
                </div>
            )}

            <div className="teams-header">
                <div className="team-name">
                    {game.initialSituation?.localTeam?.name || 'Local'}
                </div>
                <div className="vs-separator">VS</div>
                <div className="team-name">
                    {game.initialSituation?.visitTeam?.name || 'Visitor'}
                </div>
            </div>

            {activeSet && (
                <div className="live-scoreboard">
                    <div className="score-section">
                        <div className="score-value">{activeSet.pointsLocal}</div>
                        <div className="score-label">Local</div>
                    </div>
                    <div className="score-divider">
                        <div className="set-number">Set {activeSet.setNumber || game.sets.indexOf(activeSet) + 1}</div>
                    </div>
                    <div className="score-section">
                        <div className="score-value">{activeSet.pointsVisit}</div>
                        <div className="score-label">Visitor</div>
                    </div>
                </div>
            )}

            {game.sets && game.sets.length > 0 && (
                <div className="sets-history">
                    <h3>Sets</h3>
                    <div className="sets-grid">
                        {game.sets.map((set, idx) => (
                            <div key={idx} className={`set-card ${set.timeEnd ? 'finished' : 'active'}`}>
                                <div className="set-header">
                                    Set {set.setNumber || idx + 1}
                                    {!set.timeEnd && <span className="badge-active">In Progress</span>}
                                </div>
                                <div className="set-score">
                                    <span className={set.pointsLocal > set.pointsVisit ? 'winner' : ''}>
                                        {set.pointsLocal}
                                    </span>
                                    <span className="separator">-</span>
                                    <span className={set.pointsVisit > set.pointsLocal ? 'winner' : ''}>
                                        {set.pointsVisit}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {game.sanctionsList && game.sanctionsList.length > 0 && (
                <div className="sanctions-viewer">
                    <h3>Sanctions</h3>
                    <div className="sanctions-grid">
                        {game.sanctionsList.map((sanction, idx) => (
                            <div key={idx} className="sanction-card">
                                <span className={`card-icon ${sanction.type.toLowerCase()}`}>
                                    {sanction.type === 'YELLOW' ? '🟨' : '🟥'}
                                </span>
                                <div className="sanction-details">
                                    <div className="sanction-team">{sanction.team?.name}</div>
                                    <div className="sanction-moment">{sanction.marcador}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {game.finished && (
                <div className="game-finished-banner">
                    <h2>🏆 Game Finished</h2>
                    {game.result && (
                        <div className="final-result">
                            <div>Winner: {game.result.winnerTeam?.name}</div>
                            <div>Sets: {game.result.setsWonLocal} - {game.result.setsWonVisit}</div>
                        </div>
                    )}
                </div>
            )}

            {game.playing && !game.finished && (
                <div className="game-status-banner playing">
                    <span className="pulse-dot"></span>
                    Game in progress
                </div>
            )}
        </div>
    );
}

export default LiveGameView;
