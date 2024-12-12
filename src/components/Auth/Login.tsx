import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  setPassword,
  setError,
  setIsLoggingIn,
  setSavedEmails,
  setShowSuggestions,
  handleTokenStorage,
  resetAuth, // Ensure resetAuth is imported
} from "../../store/slices/authSlice";
import { loginApi } from "../../services/authService";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";

const Login: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, error, isLoggingIn, savedEmails, showSuggestions } = useSelector((state: any) => state.auth);

  // Reset auth state on component mount
  useEffect(() => {
    dispatch(resetAuth()); // Clear auth state, including email and password
    const emails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
    dispatch(setSavedEmails(emails));
  }, [dispatch]);

  const handleLoginClick = async () => {
    try {
      dispatch(setIsLoggingIn(true));
      dispatch(setError(null));

      const response = await loginApi(email, password);
      const { token } = response.data;

      dispatch(handleTokenStorage(token));

      const decodedToken = JSON.parse(atob(token.split(".")[1]));
      const userRole = decodedToken["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      navigate(userRole === "Admin" ? "/admin" : "/user");
    } catch (error) {
      dispatch(setError("Login failed. Please check your credentials."));
      console.error(error);
    } finally {
      dispatch(setIsLoggingIn(false));
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setEmail(e.target.value));
  };

  const handleSuggestionClick = (suggestion: string) => {
    dispatch(setEmail(suggestion));
    dispatch(setShowSuggestions(false)); // Hide suggestions after clicking
  };

  const filteredSuggestions = savedEmails.filter((savedEmail: string) =>
    savedEmail.toLowerCase().startsWith(email.toLowerCase())
  );

  return (
    <motion.div className="flex h-screen items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Login</h2>
        <div className="relative">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Email"
            className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
            onFocus={() => dispatch(setShowSuggestions(true))}
          />
          {showSuggestions && email && filteredSuggestions.length > 0 && (
            <div
              className="absolute left-0 mt-1 bg-white shadow-lg rounded-md border border-gray-300 max-h-40 overflow-y-auto max-w-full w-full"
            >
              {filteredSuggestions.map((suggestion: string) => (
                <div
                  key={suggestion}
                  className="p-2 cursor-pointer hover:bg-gray-100 text-gray-800"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
        <input
          type="password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <motion.button
          onClick={handleLoginClick}
          className={`w-full py-3 rounded-lg font-semibold transition-colors ${
            isLoggingIn ? "bg-gray-500 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 text-white"
          }`}
          disabled={isLoggingIn}
        >
          {isLoggingIn ? "Logging In..." : "Login"}
        </motion.button>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <div className="text-center mt-4">
          <Link to="/register" className="text-indigo-500 hover:text-indigo-600">
            Sign Up
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Login;
