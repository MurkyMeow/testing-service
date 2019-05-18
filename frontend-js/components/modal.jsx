import { useState } from 'react';

export const useModal = initial => {
  const [modalOpen, setModalOpen] = useState(initial);
  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);
  const Modal = ({ children }) => (
    <div className={`modal ${modalOpen ? '' : 'modal-hidden'}`} onClick={hideModal}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
  return [Modal, showModal, hideModal];
};
