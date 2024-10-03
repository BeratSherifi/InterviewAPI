import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface User {
  id: string;
  email: string;
  role: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('No token found, please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get('https://localhost:7213/api/auth/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        setError('Error fetching users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleDelete = async (userId: string) => {
    // Confirm deletion
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`https://localhost:7213/api/auth/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Remove the deleted user from state
        setUsers(users.filter(user => user.id !== userId));
      } catch (error) {
        setError('Error deleting user');
      }
    }
  };

  if (loading) return <div className="text-center">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User List</h2>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-1 px-4 rounded"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
