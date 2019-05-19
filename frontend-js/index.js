import { useState, useEffect } from 'react';
import { remove, put, get } from './api';

const state = {};
const listeners = {};

const useGlobalState = (key, initial) => {
  if (!(key in state)) {
    state[key] = initial;
    listeners[key] = [];
  }
  const listener = listeners[key];
  const [value, setValue] = useState(state[key]);
  useEffect(() => {
    listener.push(setValue);
    return () => listener.splice(listener.indexOf(setValue), 1);
  });
  const update = newValue => {
    state[key] = newValue;
    listener.forEach(handler => handler(newValue));
  };
  return [value, update];
};

const useDocument = (endpoint, options = {}) => {
  const [items, setItems] = useGlobalState(endpoint, []);
  const ep = () => {
    if (endpoint.includes('?')) {
      return endpoint.endsWith('?')
        ? endpoint : `${endpoint}&`;
    }
    return `${endpoint}?`;
  };
  const refresh = () => {
    const { samples, relation } = options;
    const url = samples ? `${ep()}samples=${samples}` : ep();
    get(relation ? `${url}&eager=${relation}` : url)
      .then(res => setItems(res))
      .catch(console.error);
  };
  const addItem = params => {
    const { relation } = options;
    put(ep(), relation ? { ...params, eager: relation } : params)
      .then(item => setItems([...items, item]))
      .catch(console.error);
  };
  const removeItem = id => {
    remove(`${ep()}id=${id}`)
      .then(() => setItems(items.filter(x => x.id !== id)))
      .catch(console.error);
  };
  useEffect(() => {
    if (!items.length) refresh();
  }, []);
  return { items, addItem, removeItem, refresh };
};

const createKeyRegistry = () => {
  const cache = new WeakMap();
  return object => {
    if (!cache.has(object)) cache.set(object, Math.random());
    return cache.get(object);
  };
};

export {
  state,
  useGlobalState,
  useDocument,
  createKeyRegistry,
};
