import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

interface Position {
  positionId: number;
  positionName: string;
}

interface Score {
  quizId: number;
  userId: string;
  totalScore: number;
  passed: boolean;
  controlled: boolean;
}

const LowestScoresByPosition: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [scores, setScores] = useState<Score[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          return;
        }

        const response = await axios.get('https://localhost:7213/api/Position', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setPositions(response.data);
      } catch (err) {
        console.error('Error fetching positions:', err);
        setError('Failed to fetch positions.');
      }
    };

    fetchPositions();
  }, []);

  const fetchLowestScores = async (selectedPositionId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      const response = await axios.get(
        `https://localhost:7213/positions/${selectedPositionId}/lowest-scores`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.length === 0) {
        setError('No quizzes found for this position.');
        setScores([]); // Clear any previous scores
      } else {
        setScores(response.data); // Set the scores if found
        setError(null); // Clear any previous errors
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        setError('No quizzes found for this position.');
        setScores([]); // Clear previous scores on 404
      } else {
        setError('Failed to fetch lowest scores.');
        if (!err.response || err.response.status !== 404) {
          console.error('Error fetching lowest scores:', err);
        }
      }
    }
  };

  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPositionId = parseInt(event.target.value);
    if (!isNaN(selectedPositionId)) {
      fetchLowestScores(selectedPositionId);
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
        Lowest Scores by Position
      </motion.h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Position Dropdown */}
      <div className="mb-4">
        <label htmlFor="position" className="block mb-2">
          Select Position:
        </label>
        <select
          id="position"
          className="p-2 rounded bg-gray-700 text-white w-full"
          onChange={handlePositionChange}
        >
          <option value="">Select a position</option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.positionId}>
              {position.positionName}
            </option>
          ))}
        </select>
      </div>

      {/* Scores Table */}
      <table className="min-w-full bg-gray-700">
        <thead>
          <tr>
            <th className="border px-4 py-2">Quiz ID</th>
            <th className="border px-4 py-2">User ID</th>
            <th className="border px-4 py-2">Total Score</th>
            <th className="border px-4 py-2">Passed</th>
            <th className="border px-4 py-2">Controlled</th>
          </tr>
        </thead>
        <tbody>
          {scores.length > 0 ? (
            scores.map((score) => (
              <motion.tr
                key={score.quizId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <td className="border px-4 py-2">{score.quizId}</td>
                <td className="border px-4 py-2">{score.userId}</td>
                <td className="border px-4 py-2">{score.totalScore}</td>
                <td className="border px-4 py-2">{score.passed ? 'Yes' : 'No'}</td>
                <td className="border px-4 py-2">{score.controlled ? 'Yes' : 'No'}</td>
              </motion.tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center border px-4 py-2">
                No scores available for this position.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LowestScoresByPosition;
