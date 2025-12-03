import API from "../env";
import { get, getPublic } from "../http";

export function getAllGames() {
  return getPublic(API.GAMES.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Games petition failed');
      }
      return response.json();
    });
};

export function getAllOpenGames() {
  return getPublic(API.OPEN.GAMES.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Games petition failed');
      }
      return response.json();
    });
};

export function getOutstandingMatch() {
  return getPublic(API.OPEN.GAMES.OM)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Games petition failed');
      }
      return response.json();
    });
};

export function getGamesByLeague(leagueId) {
  return getPublic(API.MATCHES.LEAGUE(leagueId))
    .then((response) => {
      if (!response.ok) {
        throw new Error('Games by league petition failed');
      }
      return response.json();
    });
};

export function getGameById(gameId) {
  return getPublic(API.OPEN.GAMES.READ(gameId))
    .then((response) => {
      if (!response.ok) {
        throw new Error('Game petition failed');
      }
      return response.json();
    });
};