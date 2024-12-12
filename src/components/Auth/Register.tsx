import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setEmail, setPassword, setConfirmPassword, setError, setSuccess, setIsRegistering } from "../../store/slices/authSlice";
import { registerApi } from "../../services/authService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email, password, confirmPassword, error, success } = useSelector((state: any) => state.auth);

  const handleRegisterClick = async () => {
    if (password !== confirmPassword) {
      dispatch(setError("Passwords don't match"));
      return;
    }

    try {
      dispatch(setIsRegistering(true));
      dispatch(setError(null));

      await registerApi(email, password);

      dispatch(setSuccess("Registration successful!"));
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      dispatch(setError("Registration failed. Please try again."));
      console.error(error);
    } finally {
      dispatch(setIsRegistering(false));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl text-white font-bold mb-6 text-center">Register</h2>
        <input
          type="email"
          value={email}
          onChange={(e) => dispatch(setEmail(e.target.value))}
          placeholder="Email"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => dispatch(setPassword(e.target.value))}
          placeholder="Password"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => dispatch(setConfirmPassword(e.target.value))}
          placeholder="Confirm Password"
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <motion.button
          onClick={handleRegisterClick}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold"
        >
          Register
        </motion.button>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        {success && <div className="text-green-500 text-sm mt-4">{success}</div>}
      </motion.div>
    </div>
  );
};

export default Register;
