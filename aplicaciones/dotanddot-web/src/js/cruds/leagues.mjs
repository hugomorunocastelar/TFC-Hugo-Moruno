import API from "../env";
import { get, post } from "../http";

export function getAllLeagues() {
  return get(API.LEAGUE.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Leagues petition failed');
      }
      return response.json();
    });
};

export function findLeague(id) {
  return get(`${API.LEAGUE.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`League ${id} petition failed`);
      }
      return response.json();
    });
};

export function createLeague(leagueData) {
  return post(API.LEAGUE.CREATE, {
    leagueData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create league failed');
    }
    return response.json();
  });
};

export function updateLeague(id, leagueData) {
  return fetch(API.LEAGUE.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(leagueData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update league ${id} failed`);
    }
    return response.json();
  });
};

export function deleteLeague(id) {
  return fetch(API.LEAGUE.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete league ${id} failed`);
    }
    return response;
  });
};