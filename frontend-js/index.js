const { default: el, html, useState, useEffect } = window.neverland;

const state = {
  user: null
};

const listeners = Object
  .keys(state)
  .reduce((acc, key) => ({ ...acc, [key]: [] }), {});

const useGlobalState = key => {
  if (!(key in state)) throw Error(`State does not contain this key: ${key}`);
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

export {
  el,
  html,
  useState,
  useEffect,
  state,
  useGlobalState,
};
