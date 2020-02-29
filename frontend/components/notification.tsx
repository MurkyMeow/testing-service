import { useCallback } from 'react';
import { Notification, useSelector, useDispatch } from '../store';

import './notification.css';

export function Notification() {
  const notification = useSelector(s => s.notification || null);
  return notification && (
    <div className="notification" data-type={notification.type}>
      <div className="notification__content">{notification.text}</div>
    </div>
  );
}

const NOTIFICATION_DURATION = 3000;

export function useNotification() {
  const dispatch = useDispatch();

  const notify = useCallback((notification: Notification) => {
    dispatch({ type: 'set-notification', payload: notification });
    setTimeout(() => {
      dispatch({ type: 'set-notification', payload: undefined });
    }, NOTIFICATION_DURATION);
  }, [dispatch]);

  return { notify };
}
