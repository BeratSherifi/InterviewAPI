import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FailedQuizzes: React.FC = () => {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFailedQuizzes = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/users/failed-quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuizzes(response.data);
      } catch (error) {
        setError('Failed to fetch failed quizzes.');
      }
    };

    fetchFailedQuizzes();
  }, []);

  return (
    <div className="p-8 bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">Failed Quizzes</h2>
      {error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <table className="min-w-full bg-gray-700">
          <thead>
            <tr>
              <th className="border px-4 py-2">Quiz ID</th>
              <th className="border px-4 py-2">User ID</th>
              <th className="border px-4 py-2">Total Score</th>
            </tr>
          </thead>
          <tbody>
            {quizzes.length > 0 ? (
              quizzes.map((quiz) => (
                <tr key={quiz.quizId}>
                  <td className="border px-4 py-2">{quiz.quizId}</td>
                  <td className="border px-4 py-2">{quiz.userId}</td>
                  <td className="border px-4 py-2">{quiz.totalScore}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center border px-4 py-2">
                  No failed quizzes available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FailedQuizzes;
