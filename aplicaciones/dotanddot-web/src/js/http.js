import * as session from "./session.mjs";

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