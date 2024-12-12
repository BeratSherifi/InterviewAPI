import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuizzesThunk,
  fetchPositionsThunk,
  deleteQuizThunk,
  clearSuccess,
  clearError,
} from '../../store/slices/quizSlice';
import { RootState, AppDispatch } from '../../store/store';

const QuizList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();

  // Access state from Redux store
  const { quizzes, positions, loading, error, success } = useSelector((state: RootState) => state.quiz);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchQuizzesThunk(token)); // Fetch quizzes
      dispatch(fetchPositionsThunk(token)); // Fetch positions
    }
  }, [dispatch]);

  const handleDelete = (quizId: number) => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(deleteQuizThunk({ quizId, token })); // Dispatch the delete action
    }
  };

  const getPositionName = (positionId: number) => {
    const position = positions.find((pos) => pos.positionId === positionId);
    return position ? position.positionName : 'Unknown Position';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 p-6 rounded-lg w-full max-w-4xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl text-white font-bold mb-4 text-center">Quiz List</h2>

        {loading && <div className="text-white text-center">Loading...</div>}
        {error && (
          <div className="text-red-500 text-sm mb-4 text-center">
            {error}
            <button onClick={() => dispatch(clearError())} className="ml-2 underline">
              Dismiss
            </button>
          </div>
        )}
        {success && (
          <div className="text-green-500 text-sm mb-4 text-center">
            {success}
            <button onClick={() => dispatch(clearSuccess())} className="ml-2 underline">
              Dismiss
            </button>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto hide-scrollbar">
          {quizzes.length > 0 ? (
            <ul className="space-y-4">
              {quizzes.map((quiz) => (
                <motion.li
                  key={quiz.quizId}
                  className="bg-gray-700 p-4 rounded-lg flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div>
                    <p className="text-white text-lg font-semibold">Quiz ID: {quiz.quizId}</p>
                    <p className="text-gray-300">Total Score: {quiz.totalScore}</p>
                    <p className="text-gray-300">Passed: {quiz.passed ? 'Yes' : 'No'}</p>
                    <p className="text-gray-300">Position: {getPositionName(quiz.positionId)}</p>
                    <p className="text-gray-300">
                      Message: {quiz.controlled ? 'Your quiz has been reviewed' : 'Your quiz has not been reviewed'}
                    </p>
                  </div>
                  <motion.button
                    onClick={() => handleDelete(quiz.quizId)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg w-full md:w-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </motion.li>
              ))}
            </ul>
          ) : (
            <div className="text-white">No quizzes found.</div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default QuizList;
