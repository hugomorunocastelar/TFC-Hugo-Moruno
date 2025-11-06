import API from "../env";
import { get, post } from "../http";

export function getAllSeasons() {
  return get(API.SEASONS.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Seasons petition failed');
      }
      return response.json();
    });
};

export function findSeason(id) {
  return get(`${API.SEASONS.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Season ${id} petition failed`);
      }
      return response.json();
    });
};

export function createSeason(seasonData) {
  return post(API.SEASONS.CREATE, {
    seasonData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create season failed');
    }
    return response.json();
  });
};

export function updateSeason(id, seasonData) {
  return fetch(API.SEASONS.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(seasonData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update season ${id} failed`);
    }
    return response.json();
  });
};

export function deleteSeason(id) {
  return fetch(API.SEASONS.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete season ${id} failed`);
    }
    return response;
  });
};