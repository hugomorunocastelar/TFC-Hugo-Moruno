import * as session from "./session.mjs";

export function getPublic(URL) {

  return fetch(URL, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
}

export function put(URL, body = {}) {
  if (session.getSession() == null) throw new Error('No Session found');

  const token = session.getSession().token;

  return fetch(URL, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function del(URL) {
  if (session.getSession() == null) throw new Error('No Session found');

  const token = session.getSession().token;

  return fetch(`${URL}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

export function patch(URL, body = {}) {
  if (session.getSession() == null) throw new Error('No Session found');

  const token = session.getSession().token;

  return fetch(URL, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}

export function get(URL) {

  if (session.getSession() == null) throw new Error('No Session found');

  const token = session.getSession().token;

  return fetch(URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

export function post(URL, body = {}) {

  if (session.getSession() == null) throw new Error('No Session found');

  const token = session.getSession().token;

  return fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}