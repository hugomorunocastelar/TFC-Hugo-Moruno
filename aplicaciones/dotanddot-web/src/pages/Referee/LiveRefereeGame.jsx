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
    const [sanctionModal, setSanctionModal] = useState({ 
        isOpen: false, 
        teamId: null, 
        severity: null 
    });
    const [alignmentModal, setAlignmentModal] = useState({ 
        isOpen: false, 
        setId: null 
    });
    const [newSetModal, setNewSetModal] = useState(false);
    const [sanctionsHistoryModal, setSanctionsHistoryModal] = useState(false);
    const [localAlignment, setLocalAlignment] = useState({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
    const [visitAlignment, setVisitAlignment] = useState({ I: '', II: '', III: '', IV: '', V: '', VI: '' });

    const handleGameUpdate = useCallback((message) => {
        console.log('Game updated via WebSocket:', message.type);
        const updatedGame = message.game;
        setGame(updatedGame);
        const setsArray = [updatedGame.set1, updatedGame.set2, updatedGame.set3, updatedGame.set4, updatedGame.set5].filter(Boolean);
        if (setsArray.length > 0) {
            const currentSet = setsArray.find(s => !s.timeEnd);
            const newActiveSet = currentSet || setsArray[setsArray.length - 1];
            
            
            if (newActiveSet && (!activeSet || newActiveSet.id !== activeSet.id)) {
                if (!newActiveSet.localAlignment && !newActiveSet.visitAlignment && !newActiveSet.timeEnd) {
                    openAlignmentModal(newActiveSet.id);
                }
            }
            
            setActiveSet(newActiveSet);
        }
    }, [activeSet]);

    const { connected, error } = useWebSocket(uniqueCode, handleGameUpdate);

    const fetchGame = useCallback(async () => {
        try {
            setLoading(true);
            const response = await refereeGameApi.fetchGameByCode(uniqueCode);
            console.log('Game loaded:', response);
            setGame(response);
            
            const setsArray = [response.set1, response.set2, response.set3, response.set4, response.set5].filter(Boolean);
            if (setsArray.length > 0) {
                const currentSet = setsArray.find(s => !s.timeEnd);
                const newActiveSet = currentSet || setsArray[setsArray.length - 1];
                setActiveSet(newActiveSet);
                console.log('Active set:', newActiveSet);
                
                
                if (newActiveSet && !newActiveSet.localAlignment && !newActiveSet.visitAlignment && !newActiveSet.timeEnd) {
                    openAlignmentModal(newActiveSet.id);
                }
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
            const updatedGame = await refereeGameApi.updateSetPoints(uniqueCode, activeSet.id, team, points);
            
            if (updatedGame) {
                setGame(updatedGame);
                const setsArray = [updatedGame.set1, updatedGame.set2, updatedGame.set3, updatedGame.set4, updatedGame.set5].filter(Boolean);
                if (setsArray.length > 0) {
                    const currentSet = setsArray.find(s => s.id === activeSet.id);
                    if (currentSet) {
                        setActiveSet(currentSet);
                    }
                }
            }
        } catch (error) {
            console.error('Error updating points:', error);
        }
    };

    const openSanctionModal = (teamId, severity) => {
        setSanctionModal({ isOpen: true, teamId, severity });
    };

    const closeSanctionModal = () => {
        setSanctionModal({ isOpen: false, teamId: null, severity: null });
    };

    const openAlignmentModal = (setId) => {
        setAlignmentModal({ isOpen: true, setId });
        
        setLocalAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
        setVisitAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
    };

    const closeAlignmentModal = () => {
        setAlignmentModal({ isOpen: false, setId: null });
    };

    const handleAlignmentChange = (team, position, value) => {
        
        if (value === '' || (/^\d+$/.test(value) && parseInt(value) >= 0 && parseInt(value) <= 99)) {
            if (team === 'local') {
                setLocalAlignment(prev => ({ ...prev, [position]: value }));
            } else {
                setVisitAlignment(prev => ({ ...prev, [position]: value }));
            }
        }
    };

    const saveAlignments = async () => {
        const { setId } = alignmentModal;
        
        
        const localValid = Object.values(localAlignment).every(v => v !== '');
        const visitValid = Object.values(visitAlignment).every(v => v !== '');
        
        if (!localValid || !visitValid) {
            alert('Please fill all positions for both teams (0-99)');
            return;
        }
        
        try {
            
            const localAlignmentStr = Object.values(localAlignment).join(':') + '/';
            const visitAlignmentStr = Object.values(visitAlignment).join(':') + '/';
            
            await refereeGameApi.updateAlignments(uniqueCode, setId, localAlignmentStr, visitAlignmentStr);
            
            closeAlignmentModal();
            if (!connected) {
                await fetchGame();
            }
        } catch (error) {
            console.error('Error saving alignments:', error);
            alert('Error saving alignments. Please try again.');
        }
    };

    const startNextSet = async () => {
        
        const localValid = Object.values(localAlignment).every(v => v !== '');
        const visitValid = Object.values(visitAlignment).every(v => v !== '');
        
        if (!localValid || !visitValid) {
            alert('Please fill all positions for both teams (0-99)');
            return;
        }
        
        try {
            
            const localAlignmentStr = Object.values(localAlignment).join(':') + '/';
            const visitAlignmentStr = Object.values(visitAlignment).join(':') + '/';
            
            const response = await refereeGameApi.startNextSet(uniqueCode, localAlignmentStr, visitAlignmentStr);
            
            if (response) {
                setNewSetModal(false);
                
                setLocalAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
                setVisitAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
                
                if (!connected) {
                    await fetchGame();
                }
            }
        } catch (error) {
            console.error('Error starting next set:', error);
            alert('Error starting next set. Please try again.');
        }
    };

    const addSanction = async (sanctionType) => {
        try {
            const { teamId, severity } = sanctionModal;
            
            
            
            const isJustSeverity = sanctionType === 'YELLOW' || sanctionType === 'RED';
            const finalSeverity = isJustSeverity ? sanctionType : severity;
            const specificType = isJustSeverity ? null : sanctionType;
            
            await refereeGameApi.addGameSanction(
                uniqueCode, 
                finalSeverity, 
                teamId, 
                getCurrentScore(),
                specificType
            );
            
            closeSanctionModal();
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
                const setsArray = [response.set1, response.set2, response.set3, response.set4, response.set5].filter(Boolean);
                if (setsArray.length > 0) {
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

    const getSetsWon = () => {
        const setsArray = [game?.set1, game?.set2, game?.set3, game?.set4, game?.set5].filter(Boolean);
        let localSets = 0;
        let visitSets = 0;
        
        setsArray.forEach(set => {
            if (set.timeEnd) {
                if (set.pointsLocal > set.pointsVisit) {
                    localSets++;
                } else if (set.pointsVisit > set.pointsLocal) {
                    visitSets++;
                }
            }
        });
        
        return { localSets, visitSets };
    };

    const parseAlignment = (alignmentStr) => {
        if (!alignmentStr) return null;
        try {
            const positions = alignmentStr.split('/')[0].split(':');
            return {
                I: positions[0] || '-',
                II: positions[1] || '-',
                III: positions[2] || '-',
                IV: positions[3] || '-',
                V: positions[4] || '-',
                VI: positions[5] || '-'
            };
        } catch (error) {
            console.error('Error parsing alignment:', error);
            return null;
        }
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
                            {[game.set1, game.set2, game.set3, game.set4, game.set5].filter(Boolean).map((set, idx) => (
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
                                    <span className="set-label">Set {activeSet?.setNumber || 1}</span>
                                    <div className="sets-won-display">
                                        <span className="sets-won-number">{getSetsWon().localSets}</span>
                                        <span className="sets-separator">-</span>
                                        <span className="sets-won-number">{getSetsWon().visitSets}</span>
                                    </div>
                                    <span className="vs-label">SETS</span>
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
                            <div className="sanctions-section">
                                <div className="sanctions-grid">
                                    <div className="team-sanctions local">
                                        <h4>🏠 {game.initialSituation?.localTeam?.name || 'Local'}</h4>
                                        <div className="sanction-buttons">
                                            <button 
                                                onClick={() => openSanctionModal(game.initialSituation?.localTeam?.id, 'YELLOW')}
                                                className="btn-sanction yellow"
                                                disabled={!game.playing}
                                            >
                                                <span className="card-icon">🟨</span>
                                                <span>Yellow Card</span>
                                            </button>
                                            <button 
                                                onClick={() => openSanctionModal(game.initialSituation?.localTeam?.id, 'RED')}
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
                                                onClick={() => openSanctionModal(game.initialSituation?.visitTeam?.id, 'YELLOW')}
                                                className="btn-sanction yellow"
                                                disabled={!game.playing}
                                            >
                                                <span className="card-icon">🟨</span>
                                                <span>Yellow Card</span>
                                            </button>
                                            <button 
                                                onClick={() => openSanctionModal(game.initialSituation?.visitTeam?.id, 'RED')}
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
                                    <div className="sanctions-history-button-wrapper">
                                        <button 
                                            onClick={() => setSanctionsHistoryModal(true)}
                                            className="btn-show-sanctions"
                                        >
                                            <span className="btn-icon">📋</span>
                                            <span>View Sanctions History ({game.sanctionsList.length})</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {activeSet && (activeSet.localAlignment || activeSet.visitAlignment) && (
                            <div className="alignments-section">
                                <div className="alignments-header">
                                    <h4>⚡ Current Alignments - Set {activeSet.setNumber || 1}</h4>
                                    <button 
                                        onClick={() => openAlignmentModal(activeSet.id)}
                                        className="btn-edit-alignment"
                                        disabled={!game.playing}
                                        title="Edit alignments"
                                    >
                                        <span>✏️ Edit</span>
                                    </button>
                                </div>
                                <div className="alignments-grid">
                                    <div className="alignment-team-display local">
                                        <h5 className="alignment-team-name">🏠 {game.initialSituation?.localTeam?.name || 'Local'}</h5>
                                        {parseAlignment(activeSet.localAlignment) ? (
                                            <div className="positions-grid">
                                                {Object.entries(parseAlignment(activeSet.localAlignment)).map(([pos, num]) => (
                                                    <div key={pos} className="position-card">
                                                        <span className="position-label">{pos}</span>
                                                        <span className="position-number">{num}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-alignment">No alignment set</div>
                                        )}
                                    </div>

                                    <div className="alignment-divider-vertical"></div>

                                    <div className="alignment-team-display visitor">
                                        <h5 className="alignment-team-name">✈️ {game.initialSituation?.visitTeam?.name || 'Visitor'}</h5>
                                        {parseAlignment(activeSet.visitAlignment) ? (
                                            <div className="positions-grid">
                                                {Object.entries(parseAlignment(activeSet.visitAlignment)).map(([pos, num]) => (
                                                    <div key={pos} className="position-card">
                                                        <span className="position-label">{pos}</span>
                                                        <span className="position-number">{num}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="no-alignment">No alignment set</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {sanctionModal.isOpen && (
                        <div className="modal-overlay" onClick={closeSanctionModal}>
                            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>Select Sanction Type</h3>
                                    <button className="modal-close" onClick={closeSanctionModal}>×</button>
                                </div>
                                <div className="modal-body">
                                    <p className="modal-subtitle">
                                        Card: <strong className={sanctionModal.severity === 'YELLOW' ? 'text-yellow' : 'text-red'}>
                                            {sanctionModal.severity === 'YELLOW' ? '🟨 YELLOW' : '🟥 RED'}
                                        </strong>
                                    </p>
                                    <div className="sanction-type-grid">
                                        <button 
                                            onClick={() => addSanction(sanctionModal.severity)}
                                            className="btn-sanction-type primary"
                                        >
                                            <span className="type-icon">👤</span>
                                            <span>Individual (Player)</span>
                                        </button>
                                        <button 
                                            onClick={() => addSanction('COACH')}
                                            className="btn-sanction-type"
                                        >
                                            <span className="type-icon">👔</span>
                                            <span>Coach</span>
                                        </button>
                                        <button 
                                            onClick={() => addSanction('ASSISTANT_COACH')}
                                            className="btn-sanction-type"
                                        >
                                            <span className="type-icon">🧑‍💼</span>
                                            <span>Assistant Coach</span>
                                        </button>
                                        <button 
                                            onClick={() => addSanction('SUPPORT')}
                                            className="btn-sanction-type"
                                        >
                                            <span className="type-icon">🤝</span>
                                            <span>Support Staff</span>
                                        </button>
                                        <button 
                                            onClick={() => addSanction('IMPROPER')}
                                            className="btn-sanction-type"
                                        >
                                            <span className="type-icon">⚠️</span>
                                            <span>Improper Solicitude</span>
                                        </button>
                                        <button 
                                            onClick={() => addSanction('DELAY')}
                                            className="btn-sanction-type"
                                        >
                                            <span className="type-icon">⏱️</span>
                                            <span>Delay</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {alignmentModal.isOpen && (
                        <div className="modal-overlay" onClick={closeAlignmentModal}>
                            <div className="modal-content alignment-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>⚡ Set Alignment - Set {activeSet?.setNumber || 1}</h3>
                                    <button className="modal-close" onClick={closeAlignmentModal}>×</button>
                                </div>
                                <div className="modal-body">
                                    <p className="modal-subtitle">Enter player numbers (0-99) for each position</p>
                                    
                                    <div className="alignment-teams">
                                        <div className="alignment-team">
                                            <h4 className="alignment-team-title">🏠 {game.initialSituation?.localTeam?.name || 'Local Team'}</h4>
                                            <div className="alignment-grid">
                                                {['I', 'II', 'III', 'IV', 'V', 'VI'].map(position => (
                                                    <div key={position} className="alignment-input-group">
                                                        <label>{position}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="99"
                                                            value={localAlignment[position]}
                                                            onChange={(e) => handleAlignmentChange('local', position, e.target.value)}
                                                            placeholder="0-99"
                                                            className="alignment-input"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="alignment-divider"></div>
                                        
                                        <div className="alignment-team">
                                            <h4 className="alignment-team-title">✈️ {game.initialSituation?.visitTeam?.name || 'Visitor Team'}</h4>
                                            <div className="alignment-grid">
                                                {['I', 'II', 'III', 'IV', 'V', 'VI'].map(position => (
                                                    <div key={position} className="alignment-input-group">
                                                        <label>{position}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="99"
                                                            value={visitAlignment[position]}
                                                            onChange={(e) => handleAlignmentChange('visit', position, e.target.value)}
                                                            placeholder="0-99"
                                                            className="alignment-input"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-actions">
                                        <button onClick={closeAlignmentModal} className="btn-cancel">Cancel</button>
                                        <button onClick={saveAlignments} className="btn-save">Save Alignments</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {sanctionsHistoryModal && game.sanctionsList && game.sanctionsList.length > 0 && (
                        <div className="modal-overlay" onClick={() => setSanctionsHistoryModal(false)}>
                            <div className="modal-content sanctions-history-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>📋 Sanctions History</h3>
                                    <button className="modal-close" onClick={() => setSanctionsHistoryModal(false)}>×</button>
                                </div>
                                <div className="modal-body">
                                    <p className="modal-subtitle">{game.sanctionsList.length} sanction{game.sanctionsList.length !== 1 ? 's' : ''} recorded</p>
                                    <div className="sanctions-timeline">
                                        {game.sanctionsList.map((sanction, idx) => (
                                            <div key={idx} className="sanction-entry">
                                                <div className="sanction-number">#{idx + 1}</div>
                                                <div className="sanction-card-modal">
                                                    <div className="sanction-header">
                                                        <span className={`sanction-severity ${sanction.severity?.toLowerCase() || 'yellow'}`}>
                                                            {sanction.severity === 'RED' ? '🟥 RED CARD' : '🟨 YELLOW CARD'}
                                                        </span>
                                                        <span className="sanction-type-badge">{sanction.type}</span>
                                                    </div>
                                                    <div className="sanction-info">
                                                        <div className="sanction-team">
                                                            <strong>Team:</strong> {sanction.team?.name || 'N/A'}
                                                        </div>
                                                        <div className="sanction-score">
                                                            <strong>Score:</strong> {sanction.marcador}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {newSetModal && (
                        <div className="modal-overlay" onClick={() => setNewSetModal(false)}>
                            <div className="modal-content alignment-modal" onClick={(e) => e.stopPropagation()}>
                                <div className="modal-header">
                                    <h3>⚡ Start Next Set - Alignments Required</h3>
                                    <button className="modal-close" onClick={() => setNewSetModal(false)}>×</button>
                                </div>
                                <div className="modal-body">
                                    <p className="modal-subtitle">Enter player numbers (0-99) for each position</p>
                                    
                                    <div className="alignment-teams">
                                        <div className="alignment-team">
                                            <h4 className="alignment-team-title">🏠 {game.initialSituation?.localTeam?.name || 'Local Team'}</h4>
                                            <div className="alignment-grid">
                                                {['I', 'II', 'III', 'IV', 'V', 'VI'].map(position => (
                                                    <div key={position} className="alignment-input-group">
                                                        <label>{position}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="99"
                                                            value={localAlignment[position]}
                                                            onChange={(e) => handleAlignmentChange('local', position, e.target.value)}
                                                            placeholder="0-99"
                                                            className="alignment-input"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        
                                        <div className="alignment-divider"></div>
                                        
                                        <div className="alignment-team">
                                            <h4 className="alignment-team-title">✈️ {game.initialSituation?.visitTeam?.name || 'Visitor Team'}</h4>
                                            <div className="alignment-grid">
                                                {['I', 'II', 'III', 'IV', 'V', 'VI'].map(position => (
                                                    <div key={position} className="alignment-input-group">
                                                        <label>{position}</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="99"
                                                            value={visitAlignment[position]}
                                                            onChange={(e) => handleAlignmentChange('visit', position, e.target.value)}
                                                            placeholder="0-99"
                                                            className="alignment-input"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="modal-actions">
                                        <button onClick={() => setNewSetModal(false)} className="btn-cancel">Cancel</button>
                                        <button onClick={startNextSet} className="btn-save">Start Next Set</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="game-content-grid">
                        <div className="game-actions">
                            {game.playing && activeSet && activeSet.timeEnd && !game.finished && (
                                <div className="set-finished-notice">
                                    <div className="notice-content">
                                        <h3>🏐 Set {activeSet.setNumber || 'Current'} Finished</h3>
                                        <p>Score: {activeSet.pointsLocal} - {activeSet.pointsVisit}</p>
                                        <p className="notice-subtitle">Start the next set to continue the game</p>
                                        <button 
                                            onClick={() => {
                                                setLocalAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
                                                setVisitAlignment({ I: '', II: '', III: '', IV: '', V: '', VI: '' });
                                                setNewSetModal(true);
                                            }} 
                                            className="btn-start-set"
                                        >
                                            ▶ Start Next Set
                                        </button>
                                    </div>
                                </div>
                            )}
                            {game.playing && (!activeSet || !activeSet.timeEnd) && (
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
                    </div>
                </>
            )}
        </div>
    );
}

export default LiveRefereeGame;
