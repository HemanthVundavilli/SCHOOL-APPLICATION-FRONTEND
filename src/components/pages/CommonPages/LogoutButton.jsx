import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear stored tokens and role
    localStorage.removeItem('token');
    localStorage.removeItem('role');

    // Redirect to login or home page
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} className="logout-btn">
      Logout
    </button>
  );
};

export default LogoutButton;