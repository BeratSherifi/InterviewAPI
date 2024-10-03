import React, { useState } from 'react';
import axios from 'axios';

const UserRole: React.FC = () => {
  const [roleName, setRoleName] = useState('');  // For creating a role
  const [email, setEmail] = useState('');  // For assigning a role
  const [assignRoleName, setAssignRoleName] = useState('');  // Role to assign
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const token = localStorage.getItem('token');  // Get the JWT token

  if (!token) {
    return <div>Please log in as an admin to manage roles.</div>;
  }

  const handleCreateRole = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7213/api/auth/create-role',
        { roleName },
        {
          headers: { Authorization: `Bearer ${token}` },  // Include the token in the request
        }
      );
      setSuccess(`Role "${roleName}" created successfully!`);
      setError(null);
      setRoleName('');  // Clear the input after success
    } catch (error: any) {
      setError('Failed to create role.');
      setSuccess(null);
    }
  };

  const handleAssignRole = async () => {
    try {
      const response = await axios.post(
        'https://localhost:7213/api/auth/assign-role',
        { email, roleName: assignRoleName },
        {
          headers: { Authorization: `Bearer ${token}` },  // Include the token in the request
        }
      );
      setSuccess(`Role "${assignRoleName}" assigned to "${email}" successfully!`);
      setError(null);
      setEmail('');
      setAssignRoleName('');
    } catch (error: any) {
      setError('Failed to assign role.');
      setSuccess(null);
    }
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-900 p-8">
      <h1 className="text-4xl text-white font-bold mb-6 text-center">Manage Roles</h1>

      {/* Section to Create a New Role */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6 w-full max-w-md">
        <h2 className="text-2xl text-white font-semibold mb-4 text-center">Create Role</h2>
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={handleCreateRole}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Create Role
        </button>
      </div>

      {/* Section to Assign a Role */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-semibold mb-4 text-center">Assign Role</h2>
        <input
          type="email"
          placeholder="User Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Role Name"
          value={assignRoleName}
          onChange={(e) => setAssignRoleName(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <button
          onClick={handleAssignRole}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Assign Role
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
      {success && <div className="text-green-500 text-sm mt-4">{success}</div>}
    </div>
  );
};

export default UserRole;
