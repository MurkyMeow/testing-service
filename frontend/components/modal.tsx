import { useState, ReactNodeArray, useEffect, useCallback } from 'react';
import css from './modal.css';

export const useModal = (args: { isOpen: boolean }) => {
  const [isOpen, setIsOpen] = useState(args.isOpen);

  const showModal = () => setIsOpen(true);
  const hideModal = () => setIsOpen(false);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') hideModal();
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keyup', handleKeyUp);
    } else {
      document.removeEventListener('keyup', handleKeyUp);
    }
    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [isOpen, handleKeyUp]);

  const Modal = (props: { children: ReactNodeArray }) => (
    <div className={css.modal} hidden={!isOpen} role="dialog" aria-modal="true">
      <div className={css.content}>
        <header className={css.header}>
          <button className={css.closeBtn} onClick={hideModal}>X</button>
        </header>
        {props.children}
      </div>
    </div>
  );

  return [Modal, showModal, hideModal];
};
