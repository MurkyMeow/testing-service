import { useState } from 'react';

export const useNotification = () => {
  const [el, setEl] = useState(null);
  const notify = (type, text, timeout = 2500) => {
    setEl(
      <div className={`notification --${type}`} style={{ '--duration': `${timeout}ms` }}>
        <div className="notification__content">{text}</div>
      </div>
    );
    setTimeout(() => setEl(null), timeout);
  };
  return [el, notify];
};
