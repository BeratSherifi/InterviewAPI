import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPassedQuizzesThunk, clearError } from '../../store/slices/analyticsSlice';
import { RootState, AppDispatch } from '../../store/store'; // Update paths if necessary
import { motion } from 'framer-motion';

const PassedQuizzes: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { passedQuizzes, error, loading } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchPassedQuizzesThunk());
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <motion.h2
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Passed Quizzes
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
            {passedQuizzes.length > 0 ? (
              passedQuizzes.map((quiz) => (
                <motion.tr
                  key={quiz.quizId}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <td className="border px-4 py-2">{quiz.quizId}</td>
                  <td className="border px-4 py-2">{quiz.userId}</td>
                  <td className="border px-4 py-2">{quiz.totalScore}</td>
                </motion.tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center border px-4 py-2">
                  No passed quizzes available.
                </td>
              </tr>
            )}
          </tbody>
        </motion.table>
      )}
    </div>
  );
};

export default PassedQuizzes;
