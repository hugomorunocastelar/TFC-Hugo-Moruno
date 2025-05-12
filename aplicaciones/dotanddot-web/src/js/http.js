export {
  get,
  post
}

function get(URL) {
  const token = localStorage.getItem("token");

  return fetch(URL, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

function post(URL, body = {}) {
  const token = localStorage.getItem("token");

  return fetch(URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  })
}