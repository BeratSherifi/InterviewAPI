import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';  // Import Link for redirection

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Helper function to parse JWT token
  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing token:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7213/api/auth/login', {
        email,
        password,
      });

      if (response.data.token) {
        // Store the token in localStorage
        localStorage.setItem('token', response.data.token);
        console.log('Token stored:', response.data.token);

        // Decode the token to check the role
        const decodedToken = parseJwt(response.data.token);
        console.log('Decoded Token:', decodedToken);

        // Check the role and navigate accordingly
        if (decodedToken && decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Admin') {
          console.log('User is Admin, redirecting to Admin Dashboard');
          navigate('/admin');  // Redirect to Admin Dashboard if user is Admin
        } else {
          console.log('User is not Admin, redirecting to Quizzes');
          navigate('/quizzes');  // Redirect to Quizzes if user is not Admin
        }
      } else {
        setError('Invalid login response. No token received.');
      }
    } catch (error: any) {
      setError('Login failed. Please check your credentials.');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Login</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Login
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {error}
          </div>
        )}

        {/* Sign Up link at the bottom of the form */}
        <div className="text-center mt-4">
          <span className="text-gray-400">Don't have an account? </span>
          <Link to="/register" className="text-indigo-500 hover:text-indigo-600">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
