import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Position {
  positionId: number;
  positionName: string;
}

interface AverageScore {
  positionId: number;
  averageScore: number;
}

const AverageScoreByPosition: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [averageScore, setAverageScore] = useState<AverageScore | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch positions
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

  const fetchAverageScore = async (selectedPositionId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      const response = await axios.get(
        `https://localhost:7213/positions/${selectedPositionId}/average-score`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAverageScore({ positionId: selectedPositionId, averageScore: response.data });
      setError(null); // Clear any previous errors
    } catch (err: any) {
      if (err.response && err.response.status === 500) {
        setError('No quizzes available for this position.');
        setAverageScore(null); // Clear previous average score on 404
      } else {
        setError('Failed to fetch average score.');
        console.error('Error fetching average score:', err);
      }
    }
  };

  const handlePositionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedPositionId = parseInt(event.target.value);
    if (!isNaN(selectedPositionId)) {
      fetchAverageScore(selectedPositionId); // Fetch average score based on selected position
    }
  };

  return (
    <div className="p-8 bg-gray-800 text-white">
      <h2 className="text-2xl mb-4">Average Score by Position</h2>

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

      {/* Average Score Display */}
      {averageScore && (
        <div className="mt-4">
          <h3 className="text-xl">Average Score for Position: {positions.find(p => p.positionId === averageScore.positionId)?.positionName}</h3>
          <p className="text-lg">{averageScore.averageScore}</p>
        </div>
      )}
    </div>
  );
};

export default AverageScoreByPosition;
