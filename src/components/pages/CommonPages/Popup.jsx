import React from 'react';
import './../stylesheets/Popup.css'; // popup styles

const Popup = ({ message, onClose }) => {
  if (!message) return null;
  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <p>{message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Popup;