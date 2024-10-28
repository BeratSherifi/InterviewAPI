import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [savedEmails, setSavedEmails] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const emails = JSON.parse(localStorage.getItem('savedEmails') || '[]');
    setSavedEmails(emails);
  }, []);

  const parseJwt = (token: string) => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      return null;
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('https://localhost:7213/api/auth/login', { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);

        const decodedToken = parseJwt(response.data.token);

        if (!savedEmails.includes(email)) {
          const updatedEmails = [...savedEmails, email];
          localStorage.setItem('savedEmails', JSON.stringify(updatedEmails));
          setSavedEmails(updatedEmails);
        }

        if (decodedToken && decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] === 'Admin') {
          navigate('/admin');
        } else {
          navigate('/user');
        }
      } else {
        setError('Invalid login response. No token received.');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setEmail(suggestion);
    setShowSuggestions(false);
  };

  const filteredSuggestions = savedEmails.filter((savedEmail) =>
    savedEmail.toLowerCase().startsWith(email.toLowerCase())
  );

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md relative">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Login</h2>

        <div className="relative">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
            className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
            onFocus={() => setShowSuggestions(true)}
          />

          {/* Conditionally render the suggestion box only when there are suggestions */}
          {showSuggestions && email && filteredSuggestions.length > 0 && (
            <div className="absolute left-0 right-0 z-10 mt-1 bg-white shadow-lg rounded-md border border-gray-300 max-h-40 overflow-y-auto">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
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