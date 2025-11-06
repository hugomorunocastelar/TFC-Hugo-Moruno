import API from "../env";
import { get, post } from "../http";

export function getAllRoles() {
  return get(API.ROLES.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Roles petition failed');
      }
      return response.json();
    });
};

export function findRole(id) {
  return get(`${API.ROLES.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Role ${id} petition failed`);
      }
      return response.json();
    });
};

export function createRole(roleData) {
  return post(API.ROLES.CREATE, {
    roleData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create role failed');
    }
    return response.json();
  });
};

export function updateRole(id, roleData) {
  return fetch(API.ROLES.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roleData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update role ${id} failed`);
    }
    return response.json();
  });
};

export function deleteRole(id) {
  return fetch(API.ROLES.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete role ${id} failed`);
    }
    return response;
  });
};