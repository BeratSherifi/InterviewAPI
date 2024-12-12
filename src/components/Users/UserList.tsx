import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store/store";
import { fetchUsersThunk, deleteUserThunk } from "../../store/slices/userSlice";
import { motion } from "framer-motion";

const UserList: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { users, loading, error } = useSelector(
    (state: RootState) => state.user
  ); // Change users to user

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, [dispatch]);

  const handleDelete = (userId: string) => {
    dispatch(deleteUserThunk(userId));
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">User List</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-red-500 text-center">{error}</p>}

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
            {users.map(
              (
                user: any // You can define a type for "user" if possible
              ) => (
                <motion.tr
                  key={user.id}
                  className="hover:bg-gray-600 transition-colors duration-200"
                >
                  <td className="py-2 px-4 text-left">{user.email}</td>
                  <td className="flex py-2 px-4 text-center">
                    {user.roles.join(", ")}
                  </td>
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
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
