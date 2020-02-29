import { useEffect, ReactNode } from 'react';
import './modal.css';

export function Modal(props: { children?: ReactNode; onClose: () => void }) {
  useEffect(() => {
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && props.onClose) props.onClose();
    };
    document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [props]);

  return (
    <div className="modal" role="dialog" aria-modal="true">
      <div className="modal__content">
        <header className="modal__header">
          <button className="modal__closeBtn" onClick={props.onClose}>X</button>
        </header>
        {props.children}
      </div>
    </div>
  );
}
