import React, { useState } from 'react';
import axios from 'axios';

const CreatePosition: React.FC = () => {
  const [positionName, setPositionName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreatePosition = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('You are not authenticated. Please log in.');
        return;
      }

      await axios.post(
        'https://localhost:7213/api/Position',
        { positionName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccess(`Position "${positionName}" created successfully!`);
      setError(null);
      setPositionName('');
    } catch (error: any) {
      setError('Failed to create position.');
      setSuccess(null);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Create Position</h2>
        <input
          type="text"
          placeholder="Position Name"
          value={positionName}
          onChange={(e) => setPositionName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={handleCreatePosition}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Create Position
        </button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">
            {error}
          </div>
        )}
        {success && (
          <div className="text-green-500 text-sm mt-4 text-center">
            {success}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreatePosition;
