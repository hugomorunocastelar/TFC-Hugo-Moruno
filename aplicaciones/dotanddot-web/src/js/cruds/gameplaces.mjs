import API from "../env";
import { get, post } from "../http";

export function getAllGameplaces() {
  return get(API.GAMEPLACE.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Gameplaces petition failed');
      }
      return response.json();
    });
};

export function findGameplace(id) {
  return get(`${API.GAMEPLACE.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Gameplace ${id} petition failed`);
      }
      return response.json();
    });
};

export function createGameplace(gameplaceData) {
  return post(API.GAMEPLACE.CREATE, {
    gameplaceData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create gameplace failed');
    }
    return response.json();
  });
};

export function updateGameplace(id, gameplaceData) {
  return fetch(API.GAMEPLACE.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(gameplaceData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update gameplace ${id} failed`);
    }
    return response.json();
  });
};

export function deleteGameplace(id) {
  return fetch(API.GAMEPLACE.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete gameplace ${id} failed`);
    }
    return response;
  });
};