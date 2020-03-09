import { useCallback } from 'react';
import { ToastData, useSelector, useDispatch } from '../store';

import './notification.css';

export function Toast() {
  const notification = useSelector(s => s.toast || null);
  return notification && (
    <div className="notification" data-type={notification.type}>
      <div className="notification__content">{notification.text}</div>
    </div>
  );
}

const NOTIFICATION_DURATION = 3000;

export function useToast() {
  const dispatch = useDispatch();

  const notify = useCallback((data: ToastData) => {
    dispatch({ type: 'set-toast', payload: data });
    setTimeout(() => {
      dispatch({ type: 'set-toast', payload: undefined });
    }, NOTIFICATION_DURATION);
  }, [dispatch]);

  return { notify };
}
