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
  withKey,
  getKey,
  canEdit,
  canCreate,
};
