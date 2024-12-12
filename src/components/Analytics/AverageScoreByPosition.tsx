import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import {
  fetchPositionsThunk,
  fetchAverageScoreThunk,
  clearError,
} from '../../store/slices/analyticsSlice';
import { motion } from 'framer-motion';

const AverageScoreByPosition: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { positions, averageScore, loading, error } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    // Fetch positions when the component mounts
    dispatch(fetchPositionsThunk());
  }, [dispatch]);

  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPositionId = parseInt(event.target.value);
    if (!isNaN(selectedPositionId)) {
      dispatch(fetchAverageScoreThunk(selectedPositionId));
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
        Average Score by Position
      </motion.h2>

      {error && (
        <p className="text-red-500 mb-4">
          {error}
          <button onClick={() => dispatch(clearError())} className="ml-2 underline">
            Dismiss
          </button>
        </p>
      )}

      {/* Position Dropdown */}
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
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
      </motion.div>

      {/* Average Score Display */}
      {averageScore && (
        <motion.div
          className="mt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h3 className="text-xl">
            Average Score for Position: {positions.find(p => p.positionId === averageScore.positionId)?.positionName}
          </h3>
          <p className="text-lg">{averageScore.averageScore}</p>
        </motion.div>
      )}

      {loading && <p className="text-gray-300">Loading...</p>}
    </div>
  );
};

export default AverageScoreByPosition;
