import React from 'react';
import '../../assets/styles/basic/modal.scss';

const Modal = ({ isOpen, message, onButtonClick }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <p>{message}</p>
        <button onClick={onButtonClick}>Start</button>
      </div>
    </div>
  );
};

export default Modal;
