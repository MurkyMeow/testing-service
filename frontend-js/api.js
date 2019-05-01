export const get = (url, options) =>
  fetch(`http://localhost:4000${url}`, options)
    .then(res => res.json());

export const post = (url, data) =>
  get(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  });
