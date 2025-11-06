import API from "../env";
import { get, post } from "../http";

export function getAllReferees() {
  return get(API.REFEREE.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Referees petition failed');
      }
      return response.json();
    });
};

export function findReferee(id) {
  return get(`${API.REFEREE.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Referee ${id} petition failed`);
      }
      return response.json();
    });
};

export function createReferee(refereeData) {
  return post(API.REFEREE.CREATE, {
    refereeData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create referee failed');
    }
    return response.json();
  });
};

export function updateReferee(id, refereeData) {
  return fetch(API.REFEREE.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(refereeData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update referee ${id} failed`);
    }
    return response.json();
  });
};

export function deleteReferee(id) {
  return fetch(API.REFEREE.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete referee ${id} failed`);
    }
    return response;
  });
};