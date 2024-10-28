import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Position {
  positionId: number;
  positionName: string;
}

const PositionList: React.FC = () => {
  const [positions, setPositions] = useState<Position[]>([]);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [newPositionName, setNewPositionName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('https://localhost:7213/api/Position');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
        setError('Failed to fetch positions.');
      }
    };
    fetchPositions();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      await axios.delete(`https://localhost:7213/api/Position/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setPositions(positions.filter((position) => position.positionId !== id));
      setSuccess(`Position with ID ${id} deleted successfully.`);
      setError(null);
    } catch (error) {
      console.error('Error deleting position:', error);
      setError('Failed to delete the position.');
      setSuccess(null);
    }
  };

  const handleEdit = (position: Position) => {
    setSelectedPosition(position);
    setNewPositionName(position.positionName);
  };

  const handleUpdate = async () => {
    if (!selectedPosition) return;
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      await axios.put(
        `https://localhost:7213/api/Position/${selectedPosition.positionId}`,
        { positionName: newPositionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPositions(
        positions.map((pos) =>
          pos.positionId === selectedPosition.positionId
            ? { ...pos, positionName: newPositionName }
            : pos
        )
      );
      setSuccess(`Position with ID ${selectedPosition.positionId} updated successfully.`);
      setSelectedPosition(null);
      setError(null);
    } catch (error) {
      console.error('Error updating position:', error);
      setError('Failed to update the position.');
      setSuccess(null);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Manage Positions</h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-3">
            {positions.map((position) => (
              <li
                key={position.positionId}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
              >
                <span className="text-white">{position.positionName}</span>
                <div>
                  <button
                    onClick={() => handleEdit(position)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(position.positionId)}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {selectedPosition && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl text-white mb-4">Edit Position: {selectedPosition.positionName}</h3>
            <input
              type="text"
              value={newPositionName}
              onChange={(e) => setNewPositionName(e.target.value)}
              className="w-full p-2 mb-4 border border-gray-600 rounded-lg bg-gray-600 text-white"
            />
            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg mr-2"
              >
                Update
              </button>
              <button
                onClick={() => setSelectedPosition(null)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PositionList;
