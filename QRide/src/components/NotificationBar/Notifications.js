import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './ToastNotification.css';

const ToastNotification = ({ message, removeToast }) => {

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast();
    }, 3000); // Auto-hide after 3 seconds

    return () => {
      clearTimeout(timer);
    };
  }, [removeToast]);

  return (
    <div className="toast-notification">
      {message}
    </div>
  );
};

ToastNotification.propTypes = {
  message: PropTypes.string.isRequired,
  removeToast: PropTypes.func.isRequired
};

export default ToastNotification;
