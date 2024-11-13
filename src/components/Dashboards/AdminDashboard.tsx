import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

const AdminDashboard: React.FC = () => {
  const [showRolesDropdown, setShowRolesDropdown] = useState(false);
  const [showPositions, setShowPositions] = useState(false);
  const [showQuestions, setShowQuestions] = useState(false);
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Toggle sidebar for mobile
  const controls = useAnimation();
  const location = useLocation();

  useEffect(() => {
    controls.start({ opacity: 1 });
  }, [controls]);

  // Define dropdown animation variants
  const dropdownVariants = {
    hidden: { opacity: 0, height: 0 },
    visible: { opacity: 1, height: "auto" },
  };

  // Check if the current route is the main dashboard path
  const isMainDashboard = location.pathname === "/admin";

  return (
    <div className="h-screen flex flex-col md:flex-row overflow-hidden">
      {/* Toggle Button for Sidebar on Mobile */}
      <button
        className="md:hidden p-4 bg-gray-800 text-white text-left"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? "Hide Menu" : "Show Menu"}
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <div className="bg-gray-900 text-white w-full sm:w-1/5 md:w-1/4 lg:w-1/6 p-4 md:p-8 h-full overflow-y-auto">
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
            Admin Dashboard
          </h1>
          <ul className="space-y-4">
            {/* Manage Roles with Dropdown */}
            <li>
              <button
                className="text-indigo-500 hover:text-indigo-300 w-full text-left transition-colors duration-200"
                onClick={() => setShowRolesDropdown(!showRolesDropdown)}
              >
                Manage Roles
              </button>
              <AnimatePresence>
                {showRolesDropdown && (
                  <motion.ul
                    className="mt-2 pl-4 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <li>
                      <Link
                        to="create-role"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Create Role
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="assign-role"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Assign Role
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* User List */}
            <li>
              <Link
                to="user-list"
                className="text-indigo-500 hover:text-indigo-300 transition-colors duration-200"
              >
                User List
              </Link>
            </li>

            {/* Manage Quizzes with Dropdown */}
            <li>
              <button
                className="text-indigo-500 hover:text-indigo-300 w-full text-left transition-colors duration-200"
                onClick={() => setShowQuizzes(!showQuizzes)}
              >
                Manage Quizzes
              </button>
              <AnimatePresence>
                {showQuizzes && (
                  <motion.ul
                    className="mt-2 pl-4 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <li>
                      <Link
                        to="quizzes"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Quiz List
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="quiz/review"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Review Quizzes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="quiz/results"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        View Results
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Analytics with Dropdown */}
            <li>
              <button
                className="text-indigo-500 hover:text-indigo-300 w-full text-left transition-colors duration-200"
                onClick={() => setShowAnalytics(!showAnalytics)}
              >
                Analytics
              </button>
              <AnimatePresence>
                {showAnalytics && (
                  <motion.ul
                    className="mt-2 pl-4 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <li>
                      <Link
                        to="top-scores"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Top Scores by Position
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="lowest-scores"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Lowest Scores by Position
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="top-scores-by-email"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Top Score By Email
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="average-score"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Average Score by Position
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="highest-score"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Highest Quiz Score
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="lowest-score"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Lowest Quiz Score
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="passed-quizzes"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Passed Quizzes
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="failed-quizzes"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Failed Quizzes
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Manage Positions with Dropdown */}
            <li>
              <button
                className="text-indigo-500 hover:text-indigo-300 w-full text-left transition-colors duration-200"
                onClick={() => setShowPositions(!showPositions)}
              >
                Manage Positions
              </button>
              <AnimatePresence>
                {showPositions && (
                  <motion.ul
                    className="mt-2 pl-4 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <li>
                      <Link
                        to="create-position"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Add New Position
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="position-list"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        View All Positions
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>

            {/* Manage Questions with Dropdown */}
            <li>
              <button
                className="text-indigo-500 hover:text-indigo-300 w-full text-left transition-colors duration-200"
                onClick={() => setShowQuestions(!showQuestions)}
              >
                Manage Questions
              </button>
              <AnimatePresence>
                {showQuestions && (
                  <motion.ul
                    className="mt-2 pl-4 space-y-2"
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    variants={dropdownVariants}
                    transition={{ duration: 0.3 }}
                  >
                    <li>
                      <Link
                        to="create-question"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        Create Question
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="question-list"
                        className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                      >
                        View All Questions
                      </Link>
                    </li>
                  </motion.ul>
                )}
              </AnimatePresence>
            </li>
          </ul>

          {/* Logout button */}
          <Link
            to="/logout"
            className="mt-auto block text-red-500 hover:text-red-300 text-center md:text-left transition-colors duration-200"
          >
            Logout
          </Link>
        </div>
      )}

      {/* Main content area */}
      <motion.div
        className="w-full md:w-3/4 lg:w-5/6 p-4 bg-gray-800 h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        {isMainDashboard ? (
          <div className="text-gray-100 p-6 space-y-6">
            <h2 className="text-3xl font-bold text-center">Welcome to the Admin Dashboard!</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
              <motion.div
                className="p-6 bg-indigo-600 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">Manage Roles</h3>
                <p className="text-gray-200">Create and assign roles to users to control access and permissions.</p>
              </motion.div>

              <motion.div
                className="p-6 bg-green-600 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">Manage Quizzes</h3>
                <p className="text-gray-200">Create, review, and manage quizzes to ensure quality assessments.</p>
              </motion.div>

              <motion.div
                className="p-6 bg-yellow-600 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">View Analytics</h3>
                <p className="text-gray-200">Access detailed analytics to track performance and user engagement.</p>
              </motion.div>

              <motion.div
                className="p-6 bg-red-600 rounded-lg shadow-md hover:shadow-xl transition-shadow"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-xl font-semibold mb-2">Manage Users</h3>
                <p className="text-gray-200">View and manage user profiles and activity on the platform.</p>
              </motion.div>
            </div>

            <div className="mt-12 p-6 bg-indigo-600 rounded-lg text-center text-gray-100 shadow-md">
              <h3 className="text-2xl font-bold mb-2">Thank you for your hard work!</h3>
              <p className="text-lg">
                Your role is essential in maintaining the quality and standards of our platform. Keep up the great work!
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-gray-900 p-4 rounded-lg max-w-4xl mx-auto overflow-auto">
            <Outlet />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminDashboard;
