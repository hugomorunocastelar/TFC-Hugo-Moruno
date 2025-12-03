import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as favoritesService from '../../js/user/favorites.mjs';
import "./UserFavorites.css";

function UserFavorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); 
  const navigate = useNavigate();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    setLoading(true);
    const data = await favoritesService.getUserFavorites();
    if (data && Array.isArray(data)) {
      setFavorites(data);
    } else {
      setFavorites([]);
    }
    setLoading(false);
  };

  const handleRemoveFavorite = async (gameId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este partido de favoritos?')) {
      const result = await favoritesService.removeFavorite(gameId);
      if (result) {
        setFavorites(favorites.filter(game => game.id !== gameId));
      }
    }
  };

  const handleViewGame = (game) => {
    if (game.playing) {
      navigate(`/app/game/${game.uniqueCode}`);
    } else if (game.finished) {
      navigate(`/app/game/${game.uniqueCode}`);
    }
  };

  const getGameStatus = (game) => {
    if (game.playing) return { text: 'EN VIVO', class: 'live' };
    if (game.finished) return { text: 'FINALIZADO', class: 'finished' };
    return { text: 'PRÓXIMAMENTE', class: 'upcoming' };
  };

  const getFilteredFavorites = () => {
    if (!Array.isArray(favorites)) return [];
    
    switch (filter) {
      case 'live':
        return favorites.filter(game => game.playing);
      case 'finished':
        return favorites.filter(game => game.finished);
      case 'upcoming':
        return favorites.filter(game => !game.playing && !game.finished);
      default:
        return favorites;
    }
  };

  const filteredFavorites = getFilteredFavorites();

  if (loading) {
    return (
      <div className="favorites-container">
        <div className="favorites-loading">
          <div className="spinner"></div>
          <p>Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="favorites-container">
      <div className="favorites-header">
        <h1>Mis Partidos Favoritos</h1>
        <p className="favorites-count">
          {favorites.length} {favorites.length === 1 ? 'partido' : 'partidos'} en favoritos
        </p>
      </div>

      {favorites.length > 0 && (
        <div className="favorites-filters">
          <button 
            className={filter === 'all' ? 'active' : ''} 
            onClick={() => setFilter('all')}
          >
            Todos ({favorites.length})
          </button>
          <button 
            className={filter === 'live' ? 'active' : ''} 
            onClick={() => setFilter('live')}
          >
            En Vivo ({favorites.filter(g => g.playing).length})
          </button>
          <button 
            className={filter === 'upcoming' ? 'active' : ''} 
            onClick={() => setFilter('upcoming')}
          >
            Próximos ({favorites.filter(g => !g.playing && !g.finished).length})
          </button>
          <button 
            className={filter === 'finished' ? 'active' : ''} 
            onClick={() => setFilter('finished')}
          >
            Finalizados ({favorites.filter(g => g.finished).length})
          </button>
        </div>
      )}

      {favorites.length === 0 ? (
        <div className="favorites-empty">
          <div className="empty-icon">⭐</div>
          <h2>No tienes partidos favoritos</h2>
          <p>Añade partidos a favoritos para seguir sus actualizaciones en tiempo real</p>
          <button className="btn-explore" onClick={() => navigate('/app/competitions')}>
            Explorar Competiciones
          </button>
        </div>
      ) : filteredFavorites.length === 0 ? (
        <div className="favorites-empty">
          <h3>No hay partidos en esta categoría</h3>
          <button className="btn-filter-reset" onClick={() => setFilter('all')}>
            Ver todos los favoritos
          </button>
        </div>
      ) : (
        <div className="favorites-grid">
          {filteredFavorites.map((game) => {
            const status = getGameStatus(game);
            return (
              <div key={game.id} className="favorite-card">
                <div className="card-header">
                  <span className={`status-badge ${status.class}`}>
                    {status.text}
                  </span>
                  <button 
                    className="btn-remove" 
                    onClick={() => handleRemoveFavorite(game.id)}
                    title="Eliminar de favoritos"
                  >
                    ❌
                  </button>
                </div>

                <div className="card-body">
                  <div className="game-info">
                    <div className="game-code">#{game.uniqueCode}</div>
                    {game.details && (
                      <div className="game-details">
                        {game.details.date && (
                          <p className="game-date">
                            📅 {new Date(game.details.date).toLocaleDateString('es-ES')}
                          </p>
                        )}
                        {game.details.timeStart && (
                          <p className="game-time">
                            🕐 {new Date(game.details.timeStart).toLocaleTimeString('es-ES', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {game.initialSituation && (
                    <div className="teams-container">
                      <div className="team local">
                        <span className="team-label">Local</span>
                        <span className="team-name">
                          {game.initialSituation.localTeam?.name || 'N/A'}
                        </span>
                      </div>
                      <div className="vs">VS</div>
                      <div className="team visit">
                        <span className="team-label">Visitante</span>
                        <span className="team-name">
                          {game.initialSituation.visitTeam?.name || 'N/A'}
                        </span>
                      </div>
                    </div>
                  )}

                  {game.league && (
                    <div className="league-info">
                      <span className="league-badge">
                        {game.league.name}
                      </span>
                    </div>
                  )}
                </div>

                <div className="card-footer">
                  <button 
                    className="btn-view" 
                    onClick={() => handleViewGame(game)}
                  >
                    {game.playing ? '📡 Ver en Vivo' : game.finished ? '📊 Ver Resultado' : 'ℹ️ Ver Detalles'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UserFavorites;