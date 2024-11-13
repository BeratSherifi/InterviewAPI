import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const LowestQuizScore: React.FC = () => {
  const [score, setScore] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowestScore = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/quizzes/lowest-score', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScore(response.data);
      } catch (error) {
        setError('Failed to fetch lowest quiz score.');
      }
    };

    fetchLowestScore();
  }, []);

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
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        score && (
          <motion.div
            className="bg-gray-700 p-4 rounded-lg shadow-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <p className="mb-2"><strong>Quiz ID:</strong> {score.quizId}</p>
            <p className="mb-2"><strong>Total Score:</strong> {score.totalScore}</p>
            <p className="mb-2"><strong>User ID:</strong> {score.userId}</p>
          </motion.div>
        )
      )}
    </div>
  );
};

export default LowestQuizScore;
