import API from "../env";
import { get, getPublic } from "../http";

export function getAllOpenClubs() {
  return getPublic(API.OPEN.CLUBS.ALL)
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Clubs petition failed');
      }
      return response.json();
    });
};

export function findClub(id) {
  return getPublic(`${API.OPEN.CLUBS.ALL}/${id}`)
    .then((response) => {
      if (!response.ok)
      {
        throw new Error(`Club ${id} petition failed`);
      }
      return response.json();
    });
};

export function getAllClubs() {
  return get(API.CLUBS.ALL)
    .then((response) => {
      if (!response.ok)
      {
        throw new Error('Clubs petition failed');
      }
      return response.json();
    });
};