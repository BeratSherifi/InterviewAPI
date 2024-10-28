import React, { useState } from 'react';
import axios from 'axios';

const CreateRole: React.FC = () => {
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleCreateRole = async () => {
    if (!roleName || roleName.trim() === '') {
      setError('Role name cannot be empty.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      await axios.post(
        `https://localhost:7213/api/Auth/create-role?roleName=${roleName.trim()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(`Role "${roleName}" created successfully!`);
      setError(null);
      setRoleName('');
    } catch (error: any) {
      if (error.response) {
        setError(`Failed to create role. Server response: ${error.response.data.message || 'Unknown error'}`);
      } else {
        setError('Failed to create role. Make sure you are logged in as an admin.');
      }
      setSuccess(null);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Create Role</h2>
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={handleCreateRole}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          Create Role
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

export default CreateRole;
