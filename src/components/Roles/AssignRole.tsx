import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const AssignRole: React.FC = () => {
  const [username, setUsername] = useState('');
  const [roleName, setRoleName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleAssignRole = async () => {
    if (!username || !roleName) {
      setError('Both username and role name are required.');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No token found, please log in.');
        return;
      }

      await axios.post(
        `https://localhost:7213/api/Auth/assign-role?username=${encodeURIComponent(username)}&roleName=${encodeURIComponent(roleName)}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setSuccess(`Role "${roleName}" assigned to user "${username}" successfully!`);
      setError(null);
      setUsername('');
      setRoleName('');
    } catch (error: any) {
      if (error.response) {
        setError(`Failed to assign role. Server response: ${error.response.data.message || 'Unknown error'}`);
      } else {
        setError('Failed to assign role. Make sure you are logged in as an admin.');
      }
      setSuccess(null);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Assign Role</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <motion.button
          onClick={handleAssignRole}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Assign Role
        </motion.button>

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
      </motion.div>
    </div>
  );
};

export default AssignRole;
