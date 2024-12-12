import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchUserIdByEmailThunk,
  fetchTopScoresByUserIdThunk,
  clearError,
} from '../../store/slices/analyticsSlice';
import { RootState, AppDispatch } from '../../store/store';
import { motion } from 'framer-motion';

const TopScoresByEmail: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const { userResults, error, loading } = useSelector((state: RootState) => state.analytics);

  // Handler to fetch results when admin submits email
  const handleFetchResults = async () => {
    if (!email) {
      dispatch(clearError());
      return;
    }
    const userId = await dispatch(fetchUserIdByEmailThunk(email)).unwrap();
    if (userId) {
      dispatch(fetchTopScoresByUserIdThunk(userId));
    }
  };

  return (
    <div className="p-8 bg-gray-800 text-white">
      <motion.h2
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Top Scores by User Email
      </motion.h2>

      {error && (
        <div className="text-red-500 mb-4">
          {error}
          <button
            onClick={() => dispatch(clearError())}
            className="ml-4 underline text-blue-400 hover:text-blue-600"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Email Input */}
      <div className="mb-4">
        <label htmlFor="email" className="block mb-2">
          Enter User Email:
        </label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded bg-gray-700 text-white w-full"
          placeholder="Enter email"
        />
      </div>

      <button
        onClick={handleFetchResults}
        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        disabled={loading}
      >
        {loading ? 'Fetching Results...' : 'Fetch Results'}
      </button>

      {/* Quiz Results Table */}
      {userResults.length > 0 && (
        <motion.div
          className="mt-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl text-white mb-4">Quiz Results:</h3>
          <table className="min-w-full bg-gray-700">
            <thead>
              <tr>
                <th className="border px-4 py-2">Quiz ID</th>
                <th className="border px-4 py-2">Total Score</th>
                <th className="border px-4 py-2">Passed</th>
                <th className="border px-4 py-2">Controlled</th>
              </tr>
            </thead>
            <tbody>
              {userResults.map((result: any) => (
                <tr key={result.quizId}>
                  <td className="border px-4 py-2">{result.quizId}</td>
                  <td className="border px-4 py-2">{result.totalScore}</td>
                  <td className="border px-4 py-2">{result.passed ? 'Yes' : 'No'}</td>
                  <td className="border px-4 py-2">{result.controlled ? 'Yes' : 'No'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  );
};

export default TopScoresByEmail;
