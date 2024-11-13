import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Quiz {
  quizId: number;
  totalScore: number;
  passed: boolean;
  controlled: boolean;
  message: string;
  positionId: number;
}

interface Position {
  positionId: number;
  positionName: string;
}

const QuizList: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/Quiz', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setQuizzes(response.data);
      } catch (error) {
        console.error('Error fetching quizzes:', error);
        setError('Failed to fetch quizzes.');
      }
    };

    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/Position', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setError('Failed to fetch positions.');
      }
    };

    fetchQuizzes();
    fetchPositions();
  }, []);

  const handleDelete = async (quizId: number) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7213/api/Quiz/${quizId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQuizzes((prevQuizzes) => prevQuizzes.filter((quiz) => quiz.quizId !== quizId));
      setSuccess('Quiz deleted successfully!');
      setError(null);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      setError('Failed to delete the quiz.');
      setSuccess(null);
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

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mb-4 text-center">{success}</div>}

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
