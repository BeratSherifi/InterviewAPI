import React, { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence, useAnimation } from "framer-motion";

interface UserDashboardProps {
  handleLogout: () => void;
}


const UserDashboard: React.FC<UserDashboardProps> = ({handleLogout}) => {
  const [showQuizzes, setShowQuizzes] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
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
  const isMainDashboard = location.pathname === "/user";

  return (
    <div className="h-screen flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="bg-gray-900 text-white w-full md:w-1/4 p-8 h-full md:h-screen overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          User Dashboard
        </h1>
        <ul className="space-y-4">
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
                      to="quiz/create"
                      className="text-indigo-400 hover:text-indigo-200 transition-colors duration-200"
                    >
                      Create Quiz
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

          {/* Logout button */}
          <button onClick={handleLogout} className="text-red-500 hover:text-red-300 text-center md:text-left transition-colors duration-200">
              Logout
            </button>
        </ul>
      </div>

      {/* Main content area */}
      <motion.div
        className="w-full md:w-3/4 p-8 bg-gray-800 h-full overflow-y-auto"
        initial={{ opacity: 0 }}
        animate={controls}
        transition={{ duration: 0.5 }}
      >
        {isMainDashboard ? (
          // Display welcome message and action cards only on the main dashboard path
          <div className="bg-gray-900 p-6 rounded-lg max-w-4xl mx-auto text-center shadow-lg">
            <h2 className="text-4xl font-bold mb-4 text-indigo-400">
              Welcome Back!
            </h2>
            <p className="text-lg mb-6 text-gray-400">
              We’re excited to have you here. Ready to take on new challenges?
              Here’s what you can do:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <motion.div
                className="bg-indigo-500 text-white p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-semibold mb-2">Create a Quiz</h3>
                <p className="text-gray-100">
                  Start building a new quiz to challenge your skills and test
                  your knowledge!
                </p>
              </motion.div>

              <motion.div
                className="bg-green-500 text-white p-6 rounded-lg shadow-md"
                whileHover={{ scale: 1.05 }}
              >
                <h3 className="text-2xl font-semibold mb-2">View Quiz Results</h3>
                <p className="text-gray-100">
                  Check out the results of your quizzes and see where you can
                  improve.
                </p>
              </motion.div>
            </div>

            <div className="mt-12 p-6 bg-blue-600 rounded-lg text-center text-gray-100 shadow-md">
              <h3 className="text-2xl font-bold mb-2">Good Luck!</h3>
              <p className="text-lg">
                Every quiz is a step closer to mastering your skills. Believe in
                yourself, and don’t hesitate to challenge yourself. You got
                this!
              </p>
            </div>
          </div>
        ) : (
          // Display the selected content from Outlet if not on main dashboard
          <div className="bg-gray-900 p-6 rounded-lg max-w-4xl mx-auto">
            <Outlet />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default UserDashboard;
