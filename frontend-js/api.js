export const get = (url, options) =>
  fetch(`http://localhost:4000${url}`, {
    ...options,
    credentials: 'include',
  })
    .then(res => res.json());

export const remove = (url, options) =>
  get(url, { ...options, method: 'DELETE' });

const withBody = method => (url, data) =>
  get(url, {
    method,
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  });

export const post = withBody('POST');
export const put = withBody('PUT');
