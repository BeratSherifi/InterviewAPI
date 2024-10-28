import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Use navigate to handle redirection

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();  // Use the navigate function for redirecting after success

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    try {
      // You can safely remove `response` if you don't need to handle it.
      await axios.post('https://localhost:7213/api/auth/register', {
        email,
        password,
      });

      setSuccess('Registration successful!');
      setError(null);

      // Redirect to the login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 1500);  // 1.5 second delay before redirecting
    } catch (error: any) {
      setError('Registration failed. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Register</h2>
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
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          onClick={handleRegister}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Register
        </button>

        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
      </div>
    </div>
  );
};

export default Register;