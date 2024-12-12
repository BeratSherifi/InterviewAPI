import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../store/store';
import { fetchHighestQuizScoreThunk } from '../../store/slices/analyticsSlice';

const HighestQuizScore: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { highestQuizScore, loading, error } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchHighestQuizScoreThunk());
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <motion.h2
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Highest Quiz Score
      </motion.h2>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : highestQuizScore ? (
        <motion.div
          className="bg-gray-700 p-4 rounded-lg shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <p className="mb-2">
            <strong>Quiz ID:</strong> {highestQuizScore.quizId}
          </p>
          <p className="mb-2">
            <strong>Total Score:</strong> {highestQuizScore.totalScore}
          </p>
          <p className="mb-2">
            <strong>User ID:</strong> {highestQuizScore.userId}
          </p>
        </motion.div>
      ) : (
        <p>No data available.</p>
      )}
    </div>
  );
};

export default HighestQuizScore;
