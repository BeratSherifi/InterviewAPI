import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper function to decode the JWT
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + ('0' + c.charCodeAt(0).toString(16)).slice(-2));
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const AdminUserResults: React.FC = () => {
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>(''); // Admin inputs the user's email
  const [userId, setUserId] = useState<string | null>(null);

  // Function to fetch user ID based on email
  const fetchUserIdByEmail = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        setLoading(false);
        return null;
      }

      // Fetching the list of users
      const response = await axios.get('https://localhost:7213/api/Auth/users', {
        headers: {
          Authorization: `Bearer ${token}`, // Ensure the token is included
        },
      });

      const users = response.data;
      const user = users.find((u: any) => u.email === email);

      if (user) {
        return user.id; // Return the user ID based on the email
      } else {
        setError('No user found with that email.');
        return null;
      }
    } catch (error) {
      console.error('Error fetching user ID:', error);
      setError('Failed to fetch users.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Function to fetch the quiz results by userId
  const fetchQuizResults = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        setLoading(false);
        return;
      }

      // Fetch quiz results by userId
      const response = await axios.get(`https://localhost:7213/api/Quiz/results/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the header
        },
      });

      setUserResults(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      setError('Failed to fetch quiz results.');
    } finally {
      setLoading(false);
    }
  };

  // Handler to fetch results when admin submits email
  const handleFetchResults = async () => {
    setError(null); // Clear previous errors
    const fetchedUserId = await fetchUserIdByEmail();
    if (fetchedUserId) {
      await fetchQuizResults(fetchedUserId);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">View User Quiz Results</h2>

        <input
          type="email"
          placeholder="Enter User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <button
          onClick={handleFetchResults}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
          disabled={loading}
        >
          {loading ? 'Fetching Results...' : 'Fetch Results'}
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {error}
          </div>
        )}

        {/* Scrollable Quiz Results */}
        {userResults.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl text-white mb-4">Quiz Results:</h3>
            <div className="max-h-64 overflow-y-auto bg-gray-700 p-4 rounded-lg hide-scrollbar">
              <ul className="text-white">
                {userResults.map((result: any) => (
                  <li key={result.quizId} className="mb-4">
                    <p>Quiz ID: {result.quizId}</p>
                    <p>Total Score: {result.totalScore}</p>
                    <p>Passed: {result.passed ? 'Yes' : 'No'}</p>
                    <p>Controlled: {result.controlled ? 'Yes' : 'No'}</p>
                    <p>Message: {result.message || 'No message available'}</p>
                    <p>Comment: {result.comment || 'No comment available'}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserResults;
