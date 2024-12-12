import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPositionName,
  setError,
  setSuccess,
} from "../../store/slices/positionSlice";
import { createPositionApi } from "../../services/positionService";
import { motion } from "framer-motion";

const CreatePosition: React.FC = () => {
  const dispatch = useDispatch();
  const { positionName, error, success } = useSelector(
    (state: any) => state.position
  );

  const handleCreatePosition = async () => {
    try {
      await createPositionApi(positionName);
      dispatch(setSuccess(`Position "${positionName}" created successfully!`));
      dispatch(setError(null));
      dispatch(setPositionName("")); // Clear the input field
    } catch (err: any) {
      dispatch(setError(err.message || "Failed to create position."));
      dispatch(setSuccess(null));
    }
  };

  const handlePositionNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setPositionName(e.target.value));
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Create Position
        </h2>
        <input
          type="text"
          placeholder="Position Name"
          value={positionName}
          onChange={handlePositionNameChange}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />
        <motion.button
          onClick={handleCreatePosition}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Position
        </motion.button>

        {error && (
          <div className="text-red-500 text-sm mt-4 text-center">{error}</div>
        )}
        {success && (
          <div className="text-green-500 text-sm mt-4 text-center">
            {success}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CreatePosition;
