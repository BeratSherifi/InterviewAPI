import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';

const UserList: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('https://localhost:7213/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://localhost:7213/api/auth/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">User List</h1>
      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full bg-gray-800">
          <thead>
            <tr className="bg-gray-700">
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">Roles</th>
              <th className="py-2 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <motion.tr
                key={user.id}
                className="hover:bg-gray-600 transition-colors duration-200"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <td className="py-2 px-4 text-left">{user.email}</td>
                <td className="flex py-2 px-4 text-center">{user.roles.join(', ')}</td>
                <td className="py-2 px-4 text-right">
                  <motion.button
                    className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded transition-colors duration-200"
                    onClick={() => handleDelete(user.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete
                  </motion.button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
