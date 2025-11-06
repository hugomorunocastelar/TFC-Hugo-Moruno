import API from "../env";
import { get, post } from "../http";

export function getAllPlayers() {
  return get(API.PLAYER.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Players petition failed');
      }
      return response.json();
    });
};

export function findPlayer(id) {
  return get(`${API.PLAYER.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Player ${id} petition failed`);
      }
      return response.json();
    });
};

export function createPlayer(playerData) {
  return post(API.PLAYER.CREATE, {
    playerData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create player failed');
    }
    return response.json();
  });
};

export function updatePlayer(id, playerData) {
  return fetch(API.PLAYER.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(playerData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update player ${id} failed`);
    }
    return response.json();
  });
};

export function deletePlayer(id) {
  return fetch(API.PLAYER.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete player ${id} failed`);
    }
    return response;
  });
};