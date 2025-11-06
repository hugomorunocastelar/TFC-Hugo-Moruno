import API from "../env";
import { get, post } from "../http";

export function getAllCoaches() {
  return get(API.COACH.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Coaches petition failed');
      }
      return response.json();
    });
};

export function findCoach(id) {
  return get(`${API.COACH.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Coach ${id} petition failed`);
      }
      return response.json();
    });
};

export function createCoach(coachData) {
  return post(API.COACH.CREATE, {
    coachData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create coach failed');
    }
    return response.json();
  });
};

export function updateCoach(id, coachData) {
  return fetch(API.COACH.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(coachData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update coach ${id} failed`);
    }
    return response.json();
  });
};

export function deleteCoach(id) {
  return fetch(API.COACH.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete coach ${id} failed`);
    }
    return response;
  });
};