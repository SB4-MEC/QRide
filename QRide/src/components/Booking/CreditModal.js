import React from 'react';
import ReactDOM from 'react-dom';

const modalStyles = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  padding: '2rem',
  backgroundColor: '#ffffff',
  border: '2px solid #c9e9e1',
  borderRadius: '1rem',
  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.1)',
  zIndex: 1000,
  maxWidth: '90%',
  width: '400px',
};

const overlayStyles = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  zIndex: 999,
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)'
};

const buttonGroupStyles = {
  display: 'flex',
  justifyContent: 'space-between',
  marginTop: '1.5rem',
};

const buttonStyles = {
  padding: '0.75rem 2rem',
  fontSize: '1.1rem',
  color: '#ffffff',
  backgroundColor: '#28a745',
  border: 'none',
  borderRadius: '0.5rem',
  cursor: 'pointer',
  transition: 'background-color 0.3s',
  letterSpacing: '0.06rem',
};

export default function CreditModal({ isOpen, onClose, totalCredits, handleConfirm }) {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <>
      <div style={overlayStyles} />
      <div style={modalStyles}>
        <h2>Confirm Payment</h2>
        <p>Total Credits Required: {totalCredits}</p>
        <div style={buttonGroupStyles}>
          <button style={{ ...buttonStyles, backgroundColor: '#dc3545' }} onClick={onClose}>Cancel</button>
          <button style={buttonStyles} onClick={handleConfirm}>Confirm</button>
        </div>
      </div>
    </>,
    document.getElementById('portal')
  );
}
