import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { MDBBtn } from 'mdb-react-ui-kit';
import "../styles/GeneralStyles.css"; // Asegúrate de que la ruta es correcta

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState({ show: false, message: '', title: '' });

  const showToast = (title, message) => {
    setToast({ show: true, title, message });
  };

  const hideToast = () => {
    setToast({ show: false, message: '', title: '' });
  };

  // Estilos personalizados para el toast
  const toastStyle = {
    backgroundColor: '#ad1fff', // Color de fondo morado
    color: 'white',
    minWidth: '350px',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    border: 'none'
  };

  const toastHeaderStyle = {
    backgroundColor: '#9000ff', // Un tono más oscuro para el header
    color: 'white',
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '0.75rem 1rem'
  };

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    color: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <ToastContainer 
        className="p-3" 
        position="bottom-end" 
        style={{ 
          zIndex: 9999,
          position: 'fixed',
          bottom: '20px',
          right: '20px'
        }}
      >
        <Toast 
          onClose={hideToast} 
          show={toast.show} 
          delay={4000} 
          autohide
          style={toastStyle}
        >
          <Toast.Header style={toastHeaderStyle} closeButton={false}>
            <strong className="me-auto" style={{ color: 'white' }}>{toast.title}</strong>
          </Toast.Header>
          <Toast.Body className="d-flex justify-content-between align-items-center" style={{ padding: '1rem' }}>
            <span style={{ color: 'white', fontSize: '0.95rem' }}>{toast.message}</span>
            <MDBBtn 
              style={buttonStyle}
              size='sm'
              className="ms-2 toast-button"
              onClick={hideToast}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
              }}
            >
              Cerrar
            </MDBBtn>
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);