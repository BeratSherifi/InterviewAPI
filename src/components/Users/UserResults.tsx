import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

// Helper function to decode the JWT
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const UserResults: React.FC = () => {
  const [userResults, setUserResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  // Extract the userId from the token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = parseJwt(token);
      const userIdFromToken = decodedToken?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'];
      if (userIdFromToken) {
        setUserId(userIdFromToken); // Set userId from the token
      }
    } else {
      setError('You are not authenticated. Please log in.');
    }
  }, []);

  // Function to fetch the quiz results by userId
  const fetchQuizResults = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token || !userId) {
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

  // Handler to fetch results when user submits email
  const handleFetchResults = async () => {
    setError(null); // Clear previous errors
    await fetchQuizResults();
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          View Your Quiz Results
        </h2>

        <motion.button
          onClick={handleFetchResults}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
          disabled={loading}
          whileHover={!loading ? { scale: 1.05 } : undefined}
          whileTap={!loading ? { scale: 0.95 } : undefined}
        >
          {loading ? 'Fetching Results...' : 'Fetch My Results'}
        </motion.button>

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
      </motion.div>
    </div>
  );
};

export default UserResults;
