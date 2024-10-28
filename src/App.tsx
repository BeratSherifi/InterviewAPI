import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import QuizList from "./components/Quizzes/QuizList";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import CreateRole from "./components/Roles/CreateRole";
import AssignRole from "./components/Roles/AssignRole";
import AdminDashboard from "./components/Dashboards/AdminDashboard";
import UserDashboard from "./components/Dashboards/UserDashboard";
import UserRole from "./components/Roles/UserRole";
import UserList from "./components/Users/UserList";
import CreatePosition from "./components/Positions/CreatePosition";
import PositionList from "./components/Positions/PositionList";
import CreateQuestion from "./components/Questions/CreateQuestion";
import QuestionList from "./components/Questions/QuestionList";
import CreateQuiz from "./components/Quizzes/CreateQuiz";
import QuizDetail from "./components/Quizzes/QuizDetail";
import ReviewQuiz from "./components/Quizzes/ReviewQuiz";
import UserResults from "./components/Users/UserResults";
import AdminUserResults from "./components/Users/AdminUserResults";
import AddAssignment from "./components/Assignments/AddAssignment";
import ReviewAssignments from "./components/Assignments/ReviewAssignments";
import SubmitAssignment from "./components/Assignments/SubmitAssignment";
import TopScoresByPosition from "./components/Analytics/TopScoresByPosition";
import LowestScoresByPosition from "./components/Analytics/LowestScoreByPosition";
import AverageScoreByPosition from "./components/Analytics/AverageScoreByPosition";
import HighestQuizScore from "./components/Analytics/HighestQuizScore";
import LowestQuizScore from "./components/Analytics/LowestQuizScore";
import PassedQuizzes from "./components/Analytics/PassedQuizzes";
import FailedQuizzes from "./components/Analytics/FailedQuizzes";
import TopScoresByEmail from "./components/Analytics/TopScoresByEmail";

// Helper function to parse JWT without using jwt-decode
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload); // Return the decoded payload
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
}

function App() {
  const token = localStorage.getItem("token"); // Retrieve the JWT token
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

  return (
    <div className="App">
      <header className="App-header">
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
            element={token ? <UserDashboard /> : <Navigate to="/login" />}
          >
            <Route path="quiz/create" element={<CreateQuiz />} />
            <Route path="quiz/results" element={<UserResults />} />
            <Route
              path="submit-assignment"
              element={<SubmitAssignment />}
            />{" "}
            {/* Add this line */}
            {/* Analytics Routes for Users */}
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
            <Route path="/admin" element={<AdminDashboard />}>
              <Route path="create-role" element={<CreateRole />} />
              <Route path="assign-role" element={<AssignRole />} />
              <Route path="manage-roles" element={<UserRole />} />
              <Route path="user-list" element={<UserList />} />
              <Route path="create-position" element={<CreatePosition />} />
              <Route path="position-list" element={<PositionList />} />
              <Route path="create-question" element={<CreateQuestion />} />
              <Route path="question-list" element={<QuestionList />} />
              <Route path="quizzes" element={<QuizList />} />
              <Route path="quiz/review" element={<ReviewQuiz />} />
              <Route path="quiz/results" element={<AdminUserResults />} />
              <Route path="add-assignment" element={<AddAssignment />} />
              <Route
                path="review-assignments"
                element={<ReviewAssignments />}
              />

              {/* Analytics Routes for Admins */}
              <Route path="top-scores" element={<TopScoresByPosition />} />
              <Route
                path="lowest-scores"
                element={<LowestScoresByPosition />}
              />
              <Route
                path="average-score"
                element={<AverageScoreByPosition />}
              />
              <Route
                path="top-scores-by-email"
                element={
                  token ? <TopScoresByEmail /> : <Navigate to="/login" />
                }
              />
              <Route path="highest-score" element={<HighestQuizScore />} />
              <Route path="lowest-score" element={<LowestQuizScore />} />
              <Route path="passed-quizzes" element={<PassedQuizzes />} />
              <Route path="failed-quizzes" element={<FailedQuizzes />} />
            </Route>
          )}

          {/* Quiz Management Routes for general quizzes */}
          <Route
            path="/quiz/:id"
            element={token ? <QuizDetail /> : <Navigate to="/login" />}
          />
          <Route
            path="/quiz/results"
            element={token ? <UserResults /> : <Navigate to="/login" />}
          />

          {/* Redirect any other routes to login */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
