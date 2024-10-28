import React, { useEffect, useState } from 'react';
import axios from 'axios';

const HighestQuizScore: React.FC = () => {
  const [score, setScore] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHighestScore = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/quizzes/highest-score', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setScore(response.data);
      } catch (error) {
        setError('Failed to fetch highest quiz score.');
      }
    };

    fetchHighestScore();
  }, []);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">Highest Quiz Score</h2>
      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        score && (
          <div className="bg-gray-700 p-4 rounded-lg shadow-lg">
            <p className="mb-2"><strong>Quiz ID:</strong> {score.quizId}</p>
            <p className="mb-2"><strong>Total Score:</strong> {score.totalScore}</p>
            <p className="mb-2"><strong>User ID:</strong> {score.userId}</p>
          </div>
        )
      )}
    </div>
  );
};

export default HighestQuizScore;
