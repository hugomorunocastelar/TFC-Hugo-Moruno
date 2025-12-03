import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWebSocket } from '../../hooks/useWebSocket';
import * as refereeGameApi from '../../js/referee/refereeGameApi.mjs';
import './LiveRefereeGame.css';
import Loader from '../Loader/Loader';

function LiveRefereeGame() {
    const { uniqueCode } = useParams();
    const navigate = useNavigate();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeSet, setActiveSet] = useState(null);

    const handleGameUpdate = useCallback((updatedGame) => {
        console.log('Game updated via WebSocket');
        setGame(updatedGame);
        if (updatedGame.sets && updatedGame.sets.length > 0) {
            const currentSet = updatedGame.sets.find(s => !s.timeEnd);
            setActiveSet(currentSet || updatedGame.sets[updatedGame.sets.length - 1]);
        }
    }, []);

    const { connected, error } = useWebSocket(uniqueCode, handleGameUpdate);

    const fetchGame = useCallback(async () => {
        try {
            setLoading(true);
            const response = await refereeGameApi.fetchGameByCode(uniqueCode);
            console.log('Game loaded:', response);
            setGame(response);
            
            const setsArray = refereeGameApi.getSetsArray(response);
            if (setsArray && setsArray.length > 0) {
                const currentSet = setsArray.find(s => !s.timeEnd);
                setActiveSet(currentSet || setsArray[setsArray.length - 1]);
                console.log('Active set:', currentSet || setsArray[setsArray.length - 1]);
            } else {
                console.warn('No sets found in game');
            }
            
            setLoading(false);
        } catch (error) {
            console.error('Error fetching game:', error);
            setLoading(false);
        }
    }, [uniqueCode]);

    useEffect(() => {
        fetchGame();
    }, [fetchGame]);

    const updatePoints = async (team, points) => {
        if (!activeSet) return;

        try {
            await refereeGameApi.updateSetPoints(uniqueCode, activeSet.id, team, points);
            if (!connected) {
                await fetchGame();
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const addSanction = async (teamId, type) => {
        try {
            await refereeGameApi.addGameSanction(uniqueCode, type, teamId, getCurrentScore());
            if (!connected) {
                await fetchGame();
            }
        } catch (error) {
            console.error('Error adding sanction:', error);
        }
    };

    const startGame = async () => {
        if (!window.confirm('Are you sure you want to start this game?')) return;

        try {
            const response = await refereeGameApi.startGame(uniqueCode);
            if (response) {
                setGame(response);
                const setsArray = refereeGameApi.getSetsArray(response);
                if (setsArray && setsArray.length > 0) {
                    const currentSet = setsArray.find(s => !s.timeEnd);
                    setActiveSet(currentSet || setsArray[setsArray.length - 1]);
                }
                setTimeout(() => {
                    const scoreboard = document.querySelector('.scoreboard-container');
                    if (scoreboard) {
                        scoreboard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                }, 100);
            }
        } catch (error) {
            console.error('Error starting game:', error);
            alert('Error starting game. Please try again.');
        }
    };

    const finishGame = async () => {
        if (!window.confirm('Are you sure you want to finish this game?')) return;

        try {
            await refereeGameApi.finishGame(uniqueCode);
            await fetchGame();
        } catch (error) {
            console.error('Error finishing game:', error);
        }
    };

    const getCurrentScore = () => {
        if (!activeSet) return '0-0';
        return `${activeSet.pointsLocal}-${activeSet.pointsVisit}`;
    };

    if (loading) return <Loader />;

    if (!game) {
        return (
            <div className="error-container">
                <h2>Game not found</h2>
                <button onClick={() => navigate('/referee')}>Back to games</button>
            </div>
        );
    }

    return (
        <div className="live-referee-container">
            <header className="live-header">
                <button onClick={() => navigate('/referee')} className="btn-back">← Back</button>
                <h1>Refereeing Game</h1>
                <div className={`connection-status ${connected ? 'connected' : 'disconnected'}`}>
                    {connected ? '🟢 Live' : '🔴 Offline'}
                </div>
            </header>

            {error && (
                <div className="alert alert-warning">
                    {error} - Updates will use REST fallback
                </div>
            )}

            <div className="match-header">
                <div className="match-teams">
                    <div className="team-card local">
                        <div className="team-badge">🏠</div>
                        <h2 className="team-name">{game.initialSituation?.localTeam?.name || 'Local Team'}</h2>
                        <span className="team-label">Local</span>
                    </div>
                    
                    <div className="match-info">
                        <div className="game-status-badge" data-status={game.playing ? 'playing' : game.finished ? 'finished' : 'pending'}>
                            {game.playing ? '▶ LIVE' : game.finished ? '✓ FINISHED' : '⏸ PENDING'}
                        </div>
                        <div className="game-code-display">
                            <span className="code-label">Code</span>
                            <span className="code-value">{game.uniqueCode}</span>
                        </div>
                        <div className="match-details">
                            <span className="detail-item">📍 {game.gameplace?.name || 'N/A'}</span>
                            <span className="detail-item">🏆 {game.league?.name || 'N/A'}</span>
                            {game.startTime && (
                                <span className="detail-item">🕐 {new Date(game.startTime).toLocaleTimeString()}</span>
                            )}
                        </div>
                    </div>
                    
                    <div className="team-card visitor">
                        <div className="team-badge">✈️</div>
                        <h2 className="team-name">{game.initialSituation?.visitTeam?.name || 'Visitor Team'}</h2>
                        <span className="team-label">Visitor</span>
                    </div>
                </div>
            </div>

            {!game.playing && !game.finished && (
                <div className="start-game-section">
                    <div className="start-game-card">
                        <h2>Ready to Start the Game</h2>
                        <p>Click the button below to begin refereeing this match</p>
                        <button onClick={startGame} className="btn-start-large">
                            ▶ Start Game
                        </button>
                    </div>
                </div>
            )}

            {(game.playing || game.finished) && activeSet && (
                <>
                    <div className="scoreboard-container">
                        <div className="sets-history">
                            {game.sets?.map((set, idx) => (
                                <div 
                                    key={set.id} 
                                    className={`set-card ${set.id === activeSet.id ? 'active' : set.timeEnd ? 'finished' : ''}`}
                                >
                                    <div className="set-number">Set {idx + 1}</div>
                                    <div className="set-result">
                                        <span className="set-score-local">{set.pointsLocal}</span>
                                        <span className="set-separator">-</span>
                                        <span className="set-score-visit">{set.pointsVisit}</span>
                                    </div>
                                    {set.id === activeSet.id && <span className="active-indicator">●</span>}
                                </div>
                            ))}
                        </div>

                        <div className="scoreboard">
                            <div className="score-panel">
                                <div className="score-team local">
                                    <h3>{game.initialSituation?.localTeam?.name || 'Local'}</h3>
                                    <div className="score-display">{activeSet.pointsLocal}</div>
                                    <div className="score-controls">
                                        <button 
                                            onClick={() => updatePoints('local', -1)}
                                            className="btn-point btn-subtract"
                                            disabled={!game.playing || activeSet.pointsLocal === 0}
                                            title="Subtract point"
                                        >
                                            <span className="btn-icon">−</span>
                                        </button>
                                        <button 
                                            onClick={() => updatePoints('local', 1)}
                                            className="btn-point btn-add"
                                            disabled={!game.playing}
                                            title="Add point"
                                        >
                                            <span className="btn-icon">+</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="set-info">
                                    <span className="set-label">Set {game.sets.indexOf(activeSet) + 1}</span>
                                    <div className="current-score">{getCurrentScore()}</div>
                                    <span className="vs-label">VS</span>
                                </div>

                                <div className="score-team visitor">
                                    <h3>{game.initialSituation?.visitTeam?.name || 'Visitor'}</h3>
                                    <div className="score-display">{activeSet.pointsVisit}</div>
                                    <div className="score-controls">
                                        <button 
                                            onClick={() => updatePoints('visit', -1)}
                                            className="btn-point btn-subtract"
                                            disabled={!game.playing || activeSet.pointsVisit === 0}
                                            title="Subtract point"
                                        >
                                            <span className="btn-icon">−</span>
                                        </button>
                                        <button 
                                            onClick={() => updatePoints('visit', 1)}
                                            className="btn-point btn-add"
                                            disabled={!game.playing}
                                            title="Add point"
                                        >
                                            <span className="btn-icon">+</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}

            {(game.playing || game.finished) && (
                <>
                    <div className="sanctions-section">
                        <div className="section-header">
                            <h3>⚠️ Sanctions & Warnings</h3>
                            {game.sanctionsList && game.sanctionsList.length > 0 && (
                                <span className="sanctions-count">{game.sanctionsList.length} applied</span>
                            )}
                        </div>

                        <div className="sanctions-grid">
                            <div className="team-sanctions local">
                                <h4>🏠 {game.initialSituation?.localTeam?.name || 'Local'}</h4>
                                <div className="sanction-buttons">
                                    <button 
                                        onClick={() => addSanction(game.initialSituation?.localTeam?.id, 'YELLOW')}
                                        className="btn-sanction yellow"
                                        disabled={!game.playing}
                                    >
                                        <span className="card-icon">🟨</span>
                                        <span>Yellow Card</span>
                                    </button>
                                    <button 
                                        onClick={() => addSanction(game.initialSituation?.localTeam?.id, 'RED')}
                                        className="btn-sanction red"
                                        disabled={!game.playing}
                                    >
                                        <span className="card-icon">🟥</span>
                                        <span>Red Card</span>
                                    </button>
                                </div>
                            </div>

                            <div className="team-sanctions visitor">
                                <h4>✈️ {game.initialSituation?.visitTeam?.name || 'Visitor'}</h4>
                                <div className="sanction-buttons">
                                    <button 
                                        onClick={() => addSanction(game.initialSituation?.visitTeam?.id, 'YELLOW')}
                                        className="btn-sanction yellow"
                                        disabled={!game.playing}
                                    >
                                        <span className="card-icon">🟨</span>
                                        <span>Yellow Card</span>
                                    </button>
                                    <button 
                                        onClick={() => addSanction(game.initialSituation?.visitTeam?.id, 'RED')}
                                        className="btn-sanction red"
                                        disabled={!game.playing}
                                    >
                                        <span className="card-icon">🟥</span>
                                        <span>Red Card</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {game.sanctionsList && game.sanctionsList.length > 0 && (
                            <div className="sanctions-history">
                                <h4>📋 Sanctions History</h4>
                                <div className="sanctions-timeline">
                                    {game.sanctionsList.map((sanction, idx) => (
                                        <div key={idx} className="sanction-entry">
                                            <div className="sanction-time">{idx + 1}</div>
                                            <div className={`sanction-card ${sanction.type.toLowerCase()}`}>
                                                <span className="sanction-icon">{sanction.type === 'YELLOW' ? '🟨' : '🟥'}</span>
                                                <div className="sanction-details">
                                                    <strong>{sanction.team?.name}</strong>
                                                    <span className="sanction-score">Score: {sanction.marcador}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="game-actions">
                        {game.playing && (
                            <button onClick={finishGame} className="btn-finish">
                                Finish Game
                            </button>
                        )}
                        {game.finished && (
                            <div className="game-finished-badge">
                                ✓ Game Finished
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

export default LiveRefereeGame;
