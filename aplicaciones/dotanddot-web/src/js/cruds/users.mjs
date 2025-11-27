import API from "../env";
import { get, post } from "../http";

export function getAllUsers() {
  return get(API.USERS.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Users petition failed');
      }
      return response.json();
    });
};

export function findUser(id) {
  return get(`${API.USERS.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`User ${id} petition failed`);
      }
      return response.json();
    });
};

export function createUser(userData) {
  return post(API.USERS.CREATE, {
    userData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create user failed');
    }
    return response.json();
  });
};

export function updateUser(id, userData) {
  return put(API.USERS.UPDATE(id), userData)
  .then(response => {
    if (!response.ok) {
      throw new Error(`Update user ${id} failed`);
    }
    return response.json();
  });
};

export function deleteUser(id) {
  return fetch(API.USERS.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete user ${id} failed`);
    }
    return response;
  });
};