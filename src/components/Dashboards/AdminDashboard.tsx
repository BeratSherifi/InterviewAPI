import React, { useState } from "react";
import { Link, Outlet } from "react-router-dom";

const AdminDashboard: React.FC = () => {
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const [showPositions, setShowPositions] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showAssignments, setShowAssignments] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-full md:w-1/4 p-8 h-full md:h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Admin Dashboard
        </h1>
        <ul className="space-y-4">
          {/* Manage Roles with Dropdown */}
          <li>
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowRolesDropdown(!showRolesDropdown)}
            >
              Manage Roles
            </button>
            {showRolesDropdown && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="create-role"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Create Role
                  </Link>
                </li>
                <li>
                  <Link
                    to="assign-role"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Assign Role
                  </Link>
                </li>
              </ul>
            )}
          </li>

          <li>
            <Link
              to="user-list"
              className="text-indigo-500 hover:text-indigo-300"
            >
              User List
            </Link>
          </li>

          {/* Manage Quizzes with dropdown */}
          <li>
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowQuizzes(!showQuizzes)}
            >
              Manage Quizzes
            </button>
            {showQuizzes && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="quizzes"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Quiz List
                  </Link>
                </li>
                <li>
                  <Link
                    to="quiz/review"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Review Quizzes
                  </Link>
                </li>
                <li>
                  <Link
                    to="quiz/results"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    View Results
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Analytics with Dropdown */}
          <li>
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
                    to="top-scores-by-email"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Top Score By Email
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

          {/* Manage Positions with dropdown */}
          <li>
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowPositions(!showPositions)}
            >
              Manage Positions
            </button>
            {showPositions && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="create-position"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Add New Position
                  </Link>
                </li>
                <li>
                  <Link
                    to="position-list"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    View All Positions
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Assignments with dropdown */}
          <li>
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowAssignments(!showAssignments)}
            >
              Manage Assignments
            </button>
            {showAssignments && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="add-assignment"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Add Assignment
                  </Link>
                </li>
                <li>
                  <Link
                    to="review-assignments"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Review Assignments
                  </Link>
                </li>
              </ul>
            )}
          </li>

          {/* Manage Questions with dropdown */}
          <li>
            <button
              className="text-indigo-500 hover:text-indigo-300 w-full text-left"
              onClick={() => setShowQuestions(!showQuestions)}
            >
              Manage Questions
            </button>
            {showQuestions && (
              <ul className="mt-2 pl-4 space-y-2">
                <li>
                  <Link
                    to="create-question"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    Create Question
                  </Link>
                </li>
                <li>
                  <Link
                    to="question-list"
                    className="text-indigo-400 hover:text-indigo-200"
                  >
                    View All Questions
                  </Link>
                </li>
              </ul>
            )}
          </li>
        </ul>

        {/* Logout button */}
        <Link
          to="/logout"
          className="mt-auto block text-red-500 hover:text-red-300 text-center md:text-left"
        >
          Logout
        </Link>
      </div>

      {/* Main content area */}
      <div className="w-full md:w-3/4 p-8 bg-gray-800 h-full overflow-y-auto">
        <div className="bg-gray-900 p-4 rounded-lg max-w-4xl mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
