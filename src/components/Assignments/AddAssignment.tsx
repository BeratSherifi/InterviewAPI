import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddAssignment: React.FC = () => {
  const [positions, setPositions] = useState<{ positionId: number; positionName: string }[]>([]);
  const [selectedPositionId, setSelectedPositionId] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Fetch positions
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
        setError('Failed to fetch positions.');
      }
    };

    fetchPositions();
  }, []);

  // Handle assignment submission
  const handleSubmit = async () => {
    if (!selectedPositionId || !userEmail || !title || !description) {
      setError('Please fill all fields.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const userResponse = await axios.get(`https://localhost:7213/api/Auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const user = userResponse.data.find((user: any) => user.email === userEmail);
      if (!user) {
        setError('User not found.');
        return;
      }

      const assignmentData = {
        positionId: selectedPositionId,
        userId: user.id, // Assuming the user ID is returned as `id`
        title: title,
        assignmentDescription: description,
      };

      const response = await axios.post('https://localhost:7213/api/Assignment/add', assignmentData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200 || response.status === 201) {
        setSuccess('Assignment added successfully!');
        setError(null);
        setTitle('');
        setDescription('');
        setSelectedPositionId(null);
        setUserEmail('');
      } else {
        setError('Failed to add assignment.');
      }
    } catch (err) {
      setError('Error occurred while adding assignment.');
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h2 className="text-2xl text-white mb-4">Add Assignment</h2>

      <div className="mb-4">
        <label className="block text-white">Position</label>
        <select
          value={selectedPositionId || ''}
          onChange={(e) => setSelectedPositionId(Number(e.target.value))}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
        >
          <option value="" disabled>Select Position</option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.positionId}>
              {position.positionName}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block text-white">User Email</label>
        <input
          type="email"
          value={userEmail}
          onChange={(e) => setUserEmail(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          placeholder="Enter user email"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          placeholder="Enter assignment title"
        />
      </div>

      <div className="mb-4">
        <label className="block text-white">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-3 border border-gray-600 rounded-lg bg-gray-700 text-white"
          placeholder="Enter assignment description"
        />
      </div>

      <button
        onClick={handleSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
      >
        Add Assignment
      </button>

      {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
    </div>
  );
};

export default AddAssignment;
