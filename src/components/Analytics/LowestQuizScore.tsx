import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { fetchLowestQuizScoreThunk, clearLowestQuizScore } from '../../store/slices/analyticsSlice';
import { motion } from 'framer-motion';

const LowestQuizScore: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { lowestQuizScore, loading, error } = useSelector((state: RootState) => state.analytics);

  useEffect(() => {
    dispatch(fetchLowestQuizScoreThunk());

    return () => {
      dispatch(clearLowestQuizScore());
    };
  }, [dispatch]);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <motion.h2
        className="text-2xl mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        Lowest Quiz Score
      </motion.h2>

      {loading && <p className="text-white">Loading...</p>}

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        lowestQuizScore && (
          <motion.div
            className="bg-gray-700 p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2">
              <strong>Quiz ID:</strong> {lowestQuizScore.quizId}
            </p>
            <p className="mb-2">
              <strong>Total Score:</strong> {lowestQuizScore.totalScore}
            </p>
            <p className="mb-2">
              <strong>User ID:</strong> {lowestQuizScore.userId}
            </p>
          </motion.div>
        )
      )}
    </div>
  );
};

export default LowestQuizScore;
