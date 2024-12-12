import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { resetAuth } from '../../store/slices/authSlice'; // Import reset action

const LogoutButton: React.FC = () => {
  const navigate = useNavigate(); // Hook for redirection
  const dispatch = useDispatch(); // Hook to interact with Redux

  const handleLogout = () => {
    // Reset Redux state
    dispatch(resetAuth());

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
