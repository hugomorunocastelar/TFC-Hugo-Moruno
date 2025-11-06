import API from "../env";
import { get, post } from "../http";

export function getAllTeams() {
  return get(API.TEAM.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Teams petition failed');
      }
      return response.json();
    });
};

export function findTeam(id) {
  return get(`${API.TEAM.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Team ${id} petition failed`);
      }
      return response.json();
    });
};

export function createTeam(teamData) {
  return post(API.TEAM.CREATE, {
    teamData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create team failed');
    }
    return response.json();
  });
};

export function updateTeam(id, teamData) {
  return fetch(API.TEAM.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(teamData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update team ${id} failed`);
    }
    return response.json();
  });
};

export function deleteTeam(id) {
  return fetch(API.TEAM.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete team ${id} failed`);
    }
    return response;
  });
};