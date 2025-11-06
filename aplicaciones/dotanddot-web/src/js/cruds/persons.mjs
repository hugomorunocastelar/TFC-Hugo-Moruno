import API from "../env";
import { get, post } from "../http";

export function getAllPersons() {
  return get(API.PERSON.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Persons petition failed');
      }
      return response.json();
    });
};

export function findPerson(id) {
  return get(`${API.PERSON.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Person ${id} petition failed`);
      }
      return response.json();
    });
};

export function createPerson(personData) {
  return post(API.PERSON.CREATE, {
    personData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create person failed');
    }
    return response.json();
  });
};

export function updatePerson(id, personData) {
  return fetch(API.PERSON.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(personData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update person ${id} failed`);
    }
    return response.json();
  });
};

export function deletePerson(id) {
  return fetch(API.PERSON.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete person ${id} failed`);
    }
    return response;
  });
};