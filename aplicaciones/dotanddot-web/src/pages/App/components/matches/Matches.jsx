import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Matches.css';
import Loader from '../../../Loader/Loader';
import { getAllOpenGames } from '../../../../js/home/games.mjs';
import FavoriteButton from '../../../../components/FavoriteButton/FavoriteButton';

function Matches() {
    const navigate = useNavigate();
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        getAllOpenGames()
            .then((data) => {
                setGames(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error loading games:', error);
                setLoading(false);
            });
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getUTCDate().toString().padStart(2, '0')}-${(date.getUTCMonth() + 1).toString().padStart(2, '0')}-${date.getUTCFullYear()}`;
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return `${date.getUTCHours().toString().padStart(2, '0')}:${date.getUTCMinutes().toString().padStart(2, '0')}`;
    };

    const getFilteredGames = () => {
        switch (selectedFilter) {
            case 'finished':
                return games.filter(g => g.finished && !g.playing);
            case 'playing':
                return games.filter(g => g.playing);
            case 'upcoming':
                return games.filter(g => !g.finished && !g.playing);
            default:
                return games;
        }
    };

    const filteredGames = getFilteredGames();

    const getStatusBadge = (game) => {
        if (game.finished) return <span className="status-badge finished">Finished</span>;
        if (game.playing) return <span className="status-badge playing">Playing</span>;
        return <span className="status-badge upcoming">Upcoming</span>;
    };

    if (loading) return <Loader />;

    return (
        <div className="matches-container">
            <div className="matches-sidebar">
                <h2>Filters</h2>
                <div className="filter-list">
                    <button
                        className={`filter-item ${selectedFilter === 'all' ? 'active' : ''}`}
                        onClick={() => setSelectedFilter('all')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5z" />
                        </svg>
                        <div className="filter-text">
                            <span className="filter-title">All Matches</span>
                            <span className="filter-count">{games.length}</span>
                        </div>
                    </button>

                    <button
                        className={`filter-item ${selectedFilter === 'finished' ? 'active' : ''}`}
                        onClick={() => setSelectedFilter('finished')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425z" />
                        </svg>
                        <div className="filter-text">
                            <span className="filter-title">Finished</span>
                            <span className="filter-count">{games.filter(g => g.finished && !g.playing).length}</span>
                        </div>
                    </button>

                    <button
                        className={`filter-item ${selectedFilter === 'playing' ? 'active' : ''}`}
                        onClick={() => setSelectedFilter('playing')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393" />
                        </svg>
                        <div className="filter-text">
                            <span className="filter-title">Playing</span>
                            <span className="filter-count">{games.filter(g => g.playing).length}</span>
                        </div>
                    </button>

                    <button
                        className={`filter-item ${selectedFilter === 'upcoming' ? 'active' : ''}`}
                        onClick={() => setSelectedFilter('upcoming')}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                        </svg>
                        <div className="filter-text">
                            <span className="filter-title">Upcoming</span>
                            <span className="filter-count">{games.filter(g => !g.finished && !g.playing).length}</span>
                        </div>
                    </button>
                </div>
            </div>

            <div className="matches-content">
                <div className="matches-header">
                    <h1>Matches</h1>
                    <span className="matches-subtitle">
                        Showing {filteredGames.length} {selectedFilter === 'all' ? '' : selectedFilter} match{filteredGames.length !== 1 ? 'es' : ''}
                    </span>
                </div>

                <div className="matches-list">
                    {filteredGames.length > 0 ? (
                        filteredGames.map((game) => (
                            <div
                                key={game.id}
                                className="match-card"
                                onClick={() => navigate(game.playing ? `/game/live/${game.uniqueCode}` : `/game/${game.id}`)}
                            >
                                <div className="match-card-header">
                                    <span className="match-code">{game.uniqueCode}</span>
                                    {getStatusBadge(game)}
                                    <FavoriteButton gameId={game.id} size="medium" />
                                </div>

                                <div className="match-card-body">
                                    <div className="match-teams">
                                        <div className="match-team">
                                            <span className="team-name">{game.initialSituation.localTeam.name}</span>
                                            <span className="team-club">{game.initialSituation.localTeam.idClub.name}</span>
                                        </div>

                                        <div className="match-score">
                                            {game.result ? (
                                                <>
                                                    <span className="score">{game.result.pointsLocal}</span>
                                                    <span className="vs">-</span>
                                                    <span className="score">{game.result.pointsVisit}</span>
                                                </>
                                            ) : (
                                                <span className="vs">VS</span>
                                            )}
                                        </div>

                                        <div className="match-team">
                                            <span className="team-name">{game.initialSituation.visitTeam.name}</span>
                                            <span className="team-club">{game.initialSituation.visitTeam.idClub.name}</span>
                                        </div>
                                    </div>

                                    <div className="match-info">
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                                            </svg>
                                            {game.result ? formatDate(game.result.timeStart) : formatDate(game.details.date)}
                                        </div>
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z" />
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0" />
                                            </svg>
                                            {game.result ? formatTime(game.result.timeStart) : formatTime(game.details.timeStart)}
                                        </div>
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10m0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6" />
                                            </svg>
                                            {game.details.city.name}
                                        </div>
                                        <div className="info-item">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                                <path d="M2.5.5A.5.5 0 0 1 3 0h10a.5.5 0 0 1 .5.5q0 .807-.034 1.536a3 3 0 1 1-1.133 5.89c-.79 1.865-1.878 2.777-2.833 3.011v2.173l1.425.356c.194.048.377.135.537.255L13.3 15.1a.5.5 0 0 1-.3.9H3a.5.5 0 0 1-.3-.9l1.838-1.379c.16-.12.343-.207.537-.255L6.5 13.11v-2.173c-.955-.234-2.043-1.146-2.833-3.012a3 3 0 1 1-1.132-5.89A33 33 0 0 1 2.5.5m.099 2.54a2 2 0 0 0 .72 3.935c-.333-1.05-.588-2.346-.72-3.935m10.083 3.935a2 2 0 0 0 .72-3.935c-.133 1.59-.388 2.885-.72 3.935" />
                                            </svg>
                                            {game.league.name}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-matches">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                                <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.5 3.5 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.5 4.5 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683M7 6.5C7 7.328 6.552 8 6 8s-1-.672-1-1.5S5.448 5 6 5s1 .672 1 1.5m4 0c0 .828-.448 1.5-1 1.5s-1-.672-1-1.5S9.448 5 10 5s1 .672 1 1.5" />
                            </svg>
                            <h3>No matches found</h3>
                            <p>There are no {selectedFilter !== 'all' ? selectedFilter : ''} matches available.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Matches;
