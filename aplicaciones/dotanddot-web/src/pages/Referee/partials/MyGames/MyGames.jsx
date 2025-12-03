import React, { useEffect, useState } from "react";
import "./MyGames.css";
import { getRefereeGames } from "../../../../js/referee/referee.mjs";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../../../../components/FavoriteButton/FavoriteButton";

function MyGames() {
    const [games, setGames] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRefereeGames();
    }, []);

    const fetchRefereeGames = async () => {
        try {
            const gamesData = await getRefereeGames();
            setGames(gamesData);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching referee games:", err);
            setError(err.message || "Error loading assigned games");
            setLoading(false);
        }
    };

    const handleGameClick = (uniqueCode) => {
        navigate(`/referee/game/${uniqueCode}`);
    };

    const getGameStatus = (game) => {
        if (game.finished) return "Finalizado";
        if (game.playing) return "En curso";
        return "Próximo";
    };

    const getGameStatusClass = (game) => {
        if (game.finished) return "status-finished";
        if (game.playing) return "status-playing";
        return "status-upcoming";
    };

    if (loading) {
        return <div className="my-games-loading">Loading games...</div>;
    }

    if (error) {
        return <div className="my-games-error">{error}</div>;
    }

    if (games.length === 0) {
        return (
            <div className="my-games-empty">
                <p>You have no games assigned currently</p>
            </div>
        );
    }

    return (
        <div className="my-games-container">
            <h2 className="my-games-title">My Assigned Games</h2>
            <div className="my-games-list">
                {games.map((game) => (
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
                                    <span className="team-label">Local:</span>
                                    <span className="team-name">
                                        {game.initialSituation?.localTeam?.name || "Por definir"}
                                    </span>
                                </div>
                                <div className="vs">VS</div>
                                <div className="team">
                                    <span className="team-label">Visitante:</span>
                                    <span className="team-name">
                                        {game.initialSituation?.visitTeam?.name || "Por definir"}
                                    </span>
                                </div>
                            </div>

                            {game.details && (
                                <div className="game-details">
                                    <div className="detail-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z" />
                                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z" />
                                        </svg>
                                        <span>{game.details.date || "Fecha por definir"}</span>
                                    </div>
                                    <div className="detail-item">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                                            <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                                        </svg>
                                        <span>{game.details.place?.name || "Lugar por definir"}</span>
                                    </div>
                                </div>
                            )}

                            {game.league && (
                                <div className="game-league">
                                    <span className="league-label">League:</span>
                                    <span className="league-name">{game.league.name}</span>
                                </div>
                            )}
                        </div>

                        <div className="game-card-footer">
                            <button className="game-manage-btn">
                                {game.playing ? "Manage Game" : "View Details"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MyGames;
