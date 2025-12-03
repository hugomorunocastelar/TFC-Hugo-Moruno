import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './RefereeGames.css';
import Loader from '../../../Loader/Loader';
import { getAllRefereeableGames } from '../../../../js/cruds/games.mjs';
import FavoriteButton from '../../../../components/FavoriteButton/FavoriteButton';

function RefereeGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchGames();
    }, []);

    const fetchGames = async () => {
        try {
            setLoading(true);
            const data = await getAllRefereeableGames();
            setGames(data || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching refereeable games:', error);
            setGames([]);
            setLoading(false);
        }
    };

    const handleGameClick = (uniqueCode) => {
        navigate(`/referee/game/${uniqueCode}`);
    };

    const getGameStatus = (game) => {
        if (game.playing) return "Ongoing";
        return "Upcoming";
    };

    const getGameStatusClass = (game) => {
        if (game.playing) return "status-playing";
        return "status-upcoming";
    };

    const filteredGames = games.filter(game => {
        if (filter === 'ongoing') return game.playing;
        if (filter === 'upcoming') return !game.playing;
        return true; 
    });

    if (loading) return <Loader />;

    return (
        <div className="referee-games-container">
            <div className="referee-games-header">
                <h2>Game Refereeing</h2>
                <p className="subtitle">Access all games to referee</p>
            </div>

            <div className="filter-tabs">
                <button 
                    className={filter === 'all' ? 'active' : ''} 
                    onClick={() => setFilter('all')}
                >
                    All ({games.length})
                </button>
                <button 
                    className={filter === 'ongoing' ? 'active' : ''} 
                    onClick={() => setFilter('ongoing')}
                >
                    Ongoing ({games.filter(g => g.playing).length})
                </button>
                <button 
                    className={filter === 'upcoming' ? 'active' : ''} 
                    onClick={() => setFilter('upcoming')}
                >
                    Upcoming ({games.filter(g => !g.playing).length})
                </button>
            </div>

            {filteredGames.length === 0 ? (
                <div className="no-games">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                    </svg>
                    <p>No {filter === 'ongoing' ? 'ongoing' : filter === 'upcoming' ? 'upcoming' : 'available'} games</p>
                </div>
            ) : (
                <div className="games-grid">
                    {filteredGames.map((game) => (
                        <div
                            key={game.id}
                            className="game-card"
                            onClick={() => handleGameClick(game.uniqueCode)}
                        >
                            <div className="game-card-header">
                                <span className="game-code">{game.uniqueCode}</span>
                                <span className={`game-status ${getGameStatusClass(game)}`}>
                                    {getGameStatus(game)}
                                </span>
                                <FavoriteButton gameId={game.id} size="small" />
                            </div>

                            <div className="game-card-body">
                                <div className="game-teams">
                                    <div className="team">
                                        <span className="team-label">Home:</span>
                                        <span className="team-name">
                                            {game.initialSituation?.localTeam?.name || "To be defined"}
                                        </span>
                                    </div>
                                    <div className="vs">VS</div>
                                    <div className="team">
                                        <span className="team-label">Visitor:</span>
                                        <span className="team-name">
                                            {game.initialSituation?.visitTeam?.name || "To be defined"}
                                        </span>
                                    </div>
                                </div>

                                {game.details && (
                                    <div className="game-info">
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                                            </svg>
                                            <span>{new Date(game.details.date).toLocaleDateString()}</span>
                                        </div>
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
                                            </svg>
                                            <span>{game.details.city?.name || "City to be defined"}</span>
                                        </div>
                                    </div>
                                )}

                                {game.league && (
                                    <div className="game-league">
                                        <span className="badge-league">{game.league.name}</span>
                                    </div>
                                )}
                            </div>

                            <div className="game-card-footer">
                                <button className="btn-referee">
                                    {game.playing ? '⚡ Manage' : '👁️ Referee'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default RefereeGames;
