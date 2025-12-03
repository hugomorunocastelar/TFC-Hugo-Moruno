import API from "../env";
import { get, getPublic, post } from "../http";

export function getAllCompetitions() {
  return getPublic(API.OPEN.COMPETITIONS.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Competitions petition failed');
      }
      return response.json();
    });
};

export function findCompetition(id) {
  return get(`${API.COMPETITION.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Competition ${id} petition failed`);
      }
      return response.json();
    });
};

export function createCompetition(competitionData) {
  return post(API.COMPETITION.CREATE, {
    competitionData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create competition failed');
    }
    return response.json();
  });
};

export function updateCompetition(id, competitionData) {
  return fetch(API.COMPETITION.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(competitionData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update competition ${id} failed`);
    }
    return response.json();
  });
};

export function deleteCompetition(id) {
  return fetch(API.COMPETITION.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete competition ${id} failed`);
    }
    return response;
  });
};