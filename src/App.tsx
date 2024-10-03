import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import QuizList from './QuizList';
import Login from './Login';
import LogoutButton from './LogoutButton';
import Register from './Register';
import CreateRole from './CreateRole';
import AssignRole from './AssignRole';
import AdminDashboard from './AdminDashboard';
import UserRole from './UserRole';
import UserList from './UserList';

// Helper function to parse JWT without using jwt-decode
function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);  // Return the decoded payload
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
}

function App() {
  const token = localStorage.getItem('token');  // Retrieve the JWT token
  let userRole = '';  // Initialize userRole

  if (token) {
    const decoded = parseJwt(token);  // Use the helper function to decode the token
    if (decoded && decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]) {
      userRole = decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Route for user list */}
          <Route path="/user-list" element={token && userRole === 'Admin' ? <UserList /> : <Navigate to="/login" />} />


          {/* Route for login page */}
          <Route path="/login" element={<Login />} />

          {/* Route for registration page */}
          <Route path="/register" element={<Register />} />

          {/* Route for quizzes page (protected route) */}
          <Route path="/quizzes" element={token ? <QuizList /> : <Navigate to="/login" />} />

          {/* Admin Dashboard - Only accessible if the user is an admin */}
          <Route path="/admin" element={token && userRole === 'Admin' ? <AdminDashboard /> : <Navigate to="/login" />} />
          
          {/* Admin-specific routes for role management */}
          <Route path="/manage-roles" element={token && userRole === 'Admin' ? <UserRole /> : <Navigate to="/login" />} />
          <Route path="/create-role" element={token && userRole === 'Admin' ? <CreateRole /> : <Navigate to="/login" />} />
          <Route path="/assign-role" element={token && userRole === 'Admin' ? <AssignRole /> : <Navigate to="/login" />} />

          {/* Redirect any other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>

        {/* Only show the logout button when the user is logged in */}
        {token && <LogoutButton />}
      </header>
    </div>
  );
}

export default App;
