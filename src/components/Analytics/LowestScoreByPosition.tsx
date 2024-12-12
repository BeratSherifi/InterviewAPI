import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchPositionsThunk,
  fetchLowestScoresThunk,
  clearLowestScores,
} from '../../store/slices/analyticsSlice';
import { motion } from 'framer-motion';

const LowestScoresByPosition: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { positions, lowestScores,error } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchPositionsThunk()); // Fetch positions on mount
  }, [dispatch]);

  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPositionId = parseInt(event.target.value);
    if (!isNaN(selectedPositionId)) {
      dispatch(fetchLowestScoresThunk(selectedPositionId)); // Fetch scores for selected position
    } else {
      dispatch(clearLowestScores()); // Clear scores if no position selected
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
          {lowestScores.length > 0 ? (
            lowestScores.map((score) => (
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
