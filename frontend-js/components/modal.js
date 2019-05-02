import { el, html, useState } from '../index.js';

const useModal = initial => {
  const [modalOpen, setModalOpen] = useState(initial);
  const showModal = () => setModalOpen(true);
  const hideModal = () => setModalOpen(false);
  return [
    el(content => html`
    <div class=${`modal ${modalOpen ? '' : 'modal-hidden'}`} onclick=${hideModal}>
      <div class="modal-content" onclick=${e => e.stopPropagation()}>
        ${content}
      </div>
    </div>
    `),
    showModal,
    hideModal,
  ];
};

export default useModal;