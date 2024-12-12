import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchFailedQuizzesThunk, clearError } from '../../store/slices/analyticsSlice';
import { motion } from 'framer-motion';

const FailedQuizzes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { failedQuizzes, error, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchFailedQuizzesThunk()); // Fetch failed quizzes on mount
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <motion.h2
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Failed Quizzes
      </motion.h2>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
          <button onClick={() => dispatch(clearError())} className="ml-2 underline">
            Dismiss
          </button>
        </p>
      )}

      {loading ? (
        <p className="text-gray-300">Loading...</p>
      ) : (
        <motion.table
          className="min-w-full bg-gray-700"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <thead>
            <tr>
              <th className="border px-4 py-2">Quiz ID</th>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {failedQuizzes.length > 0 ? (
              failedQuizzes.map((quiz) => (
                <motion.tr
                  key={quiz.quizId}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <td className="border px-4 py-2">{quiz.quizId}</td>
                  <td className="border px-4 py-2">{quiz.userId}</td>
                  <td className="border px-4 py-2">{quiz.totalScore}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center border px-4 py-2">
                  No failed quizzes available.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default FailedQuizzes;
