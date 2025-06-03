import API from "../env";
import { get } from "../http";

export function getAllCities() {
  return get(API.CITIES.ALL)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Cities petition failed');
      }
      return response.json();
    });
};

export function findCity(id) {
  return get(`${API.CITIES.READ(id)}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`City ${id} petition failed`);
      }
      return response.json();
    });
};

export function createCity(cityData) {
  return post(API.CITIES.CREATE, {
    cityData
  }).then(response => {
    if (!response.ok) {
      throw new Error('Create city failed');
    }
    return response.json();
  });
};

export function updateCity(id, cityData) {
  return fetch(API.CITIES.UPDATE(id), {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cityData),
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Update city ${id} failed`);
    }
    return response.json();
  });
};

export function deleteCity(id) {
  return fetch(API.CITIES.DELETE(id), {
    method: 'DELETE',
  }).then(response => {
    if (!response.ok) {
      throw new Error(`Delete city ${id} failed`);
    }
    return response;
  });
};