import { createStore, Dispatch } from 'redux';
import {
  useDispatch as _useDispatch,
  useSelector as _useSelector,
} from 'react-redux';
import { SelfQuery } from '../graphql-types';

export interface Notification {
  type: 'success' | 'warning' | 'error';
  text: string;
}

export interface State {
  user?: SelfQuery['self'];
  notification?: Notification;
}

export type Action =
  | { type: 'set-user'; payload: SelfQuery['self'] | undefined }
  | { type: 'set-notification'; payload: Notification | undefined }

const initialState: State = {
};

function rootReducer(state = initialState, action: Action): State {
  switch (action.type) {
    case 'set-user':
      return { ...state, user: action.payload };
    case 'set-notification':
      return { ...state, notification: action.payload };
    default:
      return state;
  }
}

export const store = createStore(rootReducer);

export const useSelector = _useSelector as <T>(selector: (state: State) => T, equalityFn?: (left: T, right: T) => boolean) => T;
export const useDispatch = _useDispatch as () => Dispatch<Action>;

