import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import { assignRoleThunk, clearRoleState } from '../../store/slices/roleSlice';
import { motion } from 'framer-motion';

const AssignRole: React.FC = () => {
  const [username, setUsername] = useState('');
  const [roleName, setRoleName] = useState('');
  const dispatch: AppDispatch = useDispatch();
  const { loading, success, error } = useSelector((state: RootState) => state.role);

  const handleAssignRole = () => {
    if (!username || !roleName) return;
    dispatch(assignRoleThunk({ username, roleName }));
  };

  const clearMessages = () => {
    dispatch(clearRoleState());
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
          onFocus={clearMessages}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="text"
          placeholder="Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          onFocus={clearMessages}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <motion.button
          onClick={handleAssignRole}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Role'}
        </motion.button>
        {error && <div className="text-red-500 text-sm mt-4 text-center">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4 text-center">{success}</div>}
      </motion.div>
    </div>
  );
};

export default AssignRole;
