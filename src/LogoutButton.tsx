import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton: React.FC = () => {
  const navigate = useNavigate();  // Hook for redirection

  const handleLogout = () => {
    // Remove the token from localStorage
    localStorage.removeItem('token');

    // Redirect to the login page
    navigate('/login');
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg font-semibold transition-colors mt-4"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
