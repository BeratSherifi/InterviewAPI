import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-1/4 p-8">
        <h1 className="text-4xl font-bold mb-6">User Dashboard</h1>
        <ul>
          {/* Manage Quizzes with dropdown */}
          <li className="mb-4">
            <button
              className="text-indigo-500 hover:text-indigo-300 focus:outline-none"
              onClick={() => setShowQuizzes(!showQuizzes)}
            >
              Manage Quizzes
            </button>
            {showQuizzes && (
              <ul>
                <li className="mb-4">
                  <Link
                    to="quiz/create"
                    className="text-indigo-500 hover:text-indigo-300"
                  >
                    Create Quiz
                  </Link>
                </li>
                <li className="mb-4">
                  <Link
                    to="quiz/results"
                    className="text-indigo-500 hover:text-indigo-300"
                  >
                    View Results
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Analytics with Dropdown */}
          <li className="mb-4">
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowAnalytics(!showAnalytics)}
            >
              Analytics
            </button>
            {showAnalytics && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="top-scores"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Top Scores by Position
                  </Link>
                </li>
                <li>
                  <Link
                    to="lowest-scores"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Lowest Scores by Position
                  </Link>
                </li>
                <li>
                  <Link
                    to="average-score"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Average Score by Position
                  </Link>
                </li>
                <li>
                  <Link
                    to="highest-score"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Highest Quiz Score
                  </Link>
                </li>
                <li>
                  <Link
                    to="lowest-score"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Lowest Quiz Score
                  </Link>
                </li>
                <li>
                  <Link
                    to="passed-quizzes"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Passed Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    to="failed-quizzes"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Failed Quizzes
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* View Assignments */}
          <li className="mb-4">
            <button
              className="text-indigo-500 hover:text-indigo-300 focus:outline-none"
              onClick={() => setShowAssignments(!showAssignments)}
            >
              View Assignments
            </button>
            {showAssignments && (
              <ul className="mt-2 pl-4">
                <li>
                  <Link
                    to="/assignments/view"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    View My Assignments
                  </Link>
                </li>
                <li>
                  <Link
                    to="submit-assignment"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Submit Assignment
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout button */}
        <Link to="/logout" className="mt-auto text-red-500 hover:text-red-300">
          Logout
        </Link>
      </div>

      {/* Main content area */}
      <div className="w-3/4 p-8 bg-gray-800">
        <div className="bg-gray-900 p-4 rounded-lg max-w-4xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
