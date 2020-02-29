import { useEffect } from 'react';
import { remove, put, get } from './api';

const useDocument = (endpoint, options = {}) => {
  const [items, setItems] = useGlobalState(endpoint, []);
  const ep = () => {
    if (endpoint.includes('?')) {
      return endpoint.endsWith('?')
        ? endpoint : `${endpoint}&`;
    }
    return `${endpoint}?`;
  };
  const refresh = async () => {
    const { samples, include } = options;
    const url = samples ? `${ep()}samples=${samples}` : ep();
    try {
      const res = await get(include ? `${url}&include=${include}` : url);
      setItems(res);
    } catch (err) {
      notify('error', 'Сбой получения данных');
    }
  };
  const addItem = async params => {
    const { include } = options;
    try {
      const item = await put(ep(), include ? { ...params, include } : params)
      notify('success', 'Успешно создано');
      setItems([...items, item]);
    } catch (err) {
      notify('error', 'Не удалось создать');
    }
  };
  const removeItem = async id => {
    try {
      await remove(`${ep()}id=${id}`);
      setItems(items.filter(x => x.id !== id));
      notify('success', 'Успешно удалено');
    } catch (err) {
      notify('error', 'Не удалось удалить');
    }
  };
  useEffect(() => {
    if (!items.length) refresh();
  }, []);
  return { items, addItem, removeItem, refresh };
};

const key = Symbol('');

const withKey = object => ({ ...object, [key]: Math.random() });
const getKey = object => object.id || object[key];

const canEdit = item =>
  item && item.creator && state.user &&
  (state.user.role === 'admin' || state.user.id === item.creator.id);

const canCreate = () =>
  state.user &&
    (state.user.role === 'admin' || state.user.role === 'teacher');

export {
  useDocument,
  withKey,
  getKey,
  canEdit,
  canCreate,
};
