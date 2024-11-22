import React, { useEffect, useCallback,useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import QuizList from "./components/Quizzes/QuizList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CreateRole from "./components/Roles/CreateRole";
import AssignRole from "./components/Roles/AssignRole";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";
import UserList from "./components/Users/UserList";
import CreatePosition from "./components/Positions/CreatePosition";
import PositionList from "./components/Positions/PositionList";
import CreateQuestion from "./components/Questions/CreateQuestion";
import QuestionList from "./components/Questions/QuestionList";
import CreateQuiz from "./components/Quizzes/CreateQuiz";
import ReviewQuiz from "./components/Quizzes/ReviewQuiz";
import UserResults from "./components/Users/UserResults";
import AdminUserResults from "./components/Users/AdminUserResults";
import TopScoresByPosition from "./components/Analytics/TopScoresByPosition";
import LowestScoresByPosition from "./components/Analytics/LowestScoreByPosition";
import AverageScoreByPosition from "./components/Analytics/AverageScoreByPosition";
import HighestQuizScore from "./components/Analytics/HighestQuizScore";
import LowestQuizScore from "./components/Analytics/LowestQuizScore";
import PassedQuizzes from "./components/Analytics/PassedQuizzes";
import FailedQuizzes from "./components/Analytics/FailedQuizzes";
import TopScoresByEmail from "./components/Analytics/TopScoresByEmail";

// Helper function to parse and check JWT expiration
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (decoded && decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.exp;
  }
  return true;
}

function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token"); // Retrieve the JWT token
  const [isTokenExpiredWarning, setIsTokenExpiredWarning] = useState(false);
  let userRole = ""; // Initialize userRole

  if (token) {
    const decoded = parseJwt(token); // Use the helper function to decode the token
    if (
      decoded &&
      decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    ) {
      userRole =
        decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
    }
  }

  // Logout function wrapped with useCallback
  const handleLogout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login"); // Redirect to login page
  }, [navigate]);

  // Automatic token expiration and logout handling
  useEffect(() => {
    const interval = setInterval(() => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        setIsTokenExpiredWarning(true); // Trigger logout if token is expired
      }
    }, 1000 * 60); // Check every minute

    return () => clearInterval(interval); // Cleanup on unmount
  }, []); // Add handleLogout to dependencies

  return (
    <div className="App">
      <header className="App-header">

         {/* Token expiration warning */}
         {isTokenExpiredWarning && (
          <div className="fixed top-0 left-0 right-0 bg-red-500 text-white text-center p-4 z-50">
            Your session has expired. Please log in again.
          </div>
        )}

        
        <Routes>
          {/* Default route redirects to login */}
          <Route path="/" element={<Navigate to="/login" />} />

          {/* Route for login page */}
          <Route path="/login" element={<Login />} />

          {/* Route for registration page */}
          <Route path="/register" element={<Register />} />

          {/* User Dashboard (non-admin users) */}
          <Route
            path="/user"
            element={token ? <UserDashboard handleLogout= {handleLogout} /> : <Navigate to="/login" />}
          >
            <Route path="quiz/create" element={<CreateQuiz />} />
            <Route path="quiz/results" element={<UserResults />} />
            {/* Add Analytics Routes for Users */}
            <Route path="top-scores" element={<TopScoresByPosition />} />
            <Route path="lowest-scores" element={<LowestScoresByPosition />} />
            <Route path="average-score" element={<AverageScoreByPosition />} />
            <Route path="highest-score" element={<HighestQuizScore />} />
            <Route path="lowest-score" element={<LowestQuizScore />} />
            <Route path="passed-quizzes" element={<PassedQuizzes />} />
            <Route path="failed-quizzes" element={<FailedQuizzes />} />
            <Route
              path="top-scores-by-email"
              element={token ? <TopScoresByEmail /> : <Navigate to="/login" />}
            />
          </Route>

          {/* Admin Dashboard - Only accessible if the user is an admin */}
          {userRole === "Admin" && (
            <Route path="/admin" element={<AdminDashboard handleLogout={handleLogout}/>}>
              <Route path="create-role" element={<CreateRole />} />
              <Route path="assign-role" element={<AssignRole />} />
              <Route path="user-list" element={<UserList />} />
              <Route path="create-position" element={<CreatePosition />} />
              <Route path="position-list" element={<PositionList />} />
              <Route path="create-question" element={<CreateQuestion />} />
              <Route path="question-list" element={<QuestionList />} />
              <Route path="quizzes" element={<QuizList />} />
              <Route path="quiz/review" element={<ReviewQuiz />} />
              <Route path="quiz/results" element={<AdminUserResults />} />

              {/* Analytics Routes for Admins */}
              <Route path="top-scores" element={<TopScoresByPosition />} />
              <Route path="lowest-scores" element={<LowestScoresByPosition />} />
              <Route
                path="top-scores-by-email"
                element={
                  token ? <TopScoresByEmail /> : <Navigate to="/login" />
                }
              />
              <Route path="average-score" element={<AverageScoreByPosition />} />
              <Route path="highest-score" element={<HighestQuizScore />} />
              <Route path="lowest-score" element={<LowestQuizScore />} />
              <Route path="passed-quizzes" element={<PassedQuizzes />} />
              <Route path="failed-quizzes" element={<FailedQuizzes />} />
            </Route>
          )}

          {/* Redirect any other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
