import React, { useState, useEffect } from 'react';
import './FavoriteButton.css';
import { checkFavorite, addFavorite, removeFavorite } from '../../js/user/favorites.mjs';
import { getSession } from '../../js/session.mjs';

function FavoriteButton({ gameId, size = 'medium' }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = getSession();
    const isLoggedIn = session && session.token;
    setIsAuthenticated(isLoggedIn);

    if (isLoggedIn && gameId) {
      const checkIfFavorite = async () => {
        try {
          const result = await checkFavorite(gameId);
          setIsFavorite(result === true);
        } catch (error) {
          console.error('Error checking favorite:', error);
          setIsFavorite(false);
        }
      };
      
      checkIfFavorite();
    }
  }, [gameId]);

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
    setLoading(true);

    try {
      if (isFavorite) {
        const result = await removeFavorite(gameId);
        if (result) {
          setIsFavorite(false);
        }
      } else {
        const result = await addFavorite(gameId);
        if (result) {
          setIsFavorite(true);
        }
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <button
      className={`favorite-button ${size} ${isFavorite ? 'active' : ''} ${loading ? 'loading' : ''}`}
      onClick={handleToggleFavorite}
      disabled={loading}
      title={isFavorite ? 'Eliminar de favoritos' : 'Añadir a favoritos'}
    >
      {loading ? (
        <span className="loading-spinner">⏳</span>
      ) : (
        <span className="star-icon">{isFavorite ? '⭐' : '☆'}</span>
      )}
    </button>
  );
}

export default FavoriteButton;
