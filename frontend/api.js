import { useState, useEffect } from 'react';

export const get = (url, options) =>
  fetch(url, {
    ...options,
    credentials: 'include',
  }).then(res => {
    if (!res.ok) throw res;
    return res.json();
  });

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

export const patch = withBody('PATCH');
export const post = withBody('POST');
export const put = withBody('PUT');

export const useRequest = (request, params = {}) => {
  const [state, setState] = useState({});
  let cancelled = false;
  const modifyData = data => {
    setState({ ...state, data });
  };
  useEffect(() => {
    request().then(res => {
      if (cancelled) return;
      const data = params.only ? res[0] : res;
      setState({ data });
    }).catch(error => {
      if (cancelled) return;
      console.warn(error.status, error.statusText);
      setState({ error: error.status || 400 });
    });
    return () => cancelled = true;
  }, []);
  return [state, state.data, modifyData];
};
