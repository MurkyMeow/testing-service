import { useState } from 'react';
import css from './modal.css';

export const useModal = initial => {
  const [modalOpen, setModalOpen] = useState(initial);
  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);
  const Modal = ({ children }) => (
    <div className={css.modal} data-hidden={!modalOpen} onClick={hideModal}>
      <div className={css.modal__content} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
  return [Modal, showModal, hideModal];
};
