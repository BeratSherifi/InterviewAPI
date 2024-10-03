import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isFunctionDropdownOpen, setIsFunctionDropdownOpen] = useState(false);

  const toggleRoleDropdown = () => {
    setIsRoleDropdownOpen(!isRoleDropdownOpen);
  };

  const toggleFunctionDropdown = () => {
    setIsFunctionDropdownOpen(!isFunctionDropdownOpen);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-6 text-center">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Roles Dropdown */}
        <div className="relative">
          <button
            onClick={toggleRoleDropdown}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-center font-semibold w-full"
          >
            Manage Roles
          </button>
          {isRoleDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg">
              <Link to="/create-role" className="block p-4 hover:bg-indigo-700 text-white">
                Create Role
              </Link>
              <Link to="/assign-role" className="block p-4 hover:bg-indigo-700 text-white">
                Assign Role
              </Link>
            </div>
          )}
        </div>

        {/* User List Dropdown */}
        <div className="relative">
          <button
            onClick={toggleFunctionDropdown}
            className="p-4 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white text-center font-semibold w-full"
          >
            User Management
          </button>
          {isFunctionDropdownOpen && (
            <div className="absolute left-0 mt-2 w-full bg-gray-800 rounded-lg shadow-lg">
              <Link to="/user-list" className="block p-4 hover:bg-indigo-700 text-white">
                User List
              </Link>
              <Link to="/create-quiz" className="block p-4 hover:bg-indigo-700 text-white">
                Create Quiz
              </Link>
              <Link to="/manage-questions" className="block p-4 hover:bg-indigo-700 text-white">
                Manage Questions
              </Link>
              <Link to="/review-quizzes" className="block p-4 hover:bg-indigo-700 text-white">
                Review Quizzes
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
