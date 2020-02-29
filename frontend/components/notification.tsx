import { useGlobalState } from '../index';

import './notification.css';

export function Notification() {
  const [{ type = 'hidden', text }] = useGlobalState('notification', {});
  return (
    <div className="notification" data-type={type}>
      <div className="notification__content">{text}</div>
    </div>
  );
}
