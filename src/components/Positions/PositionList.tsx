import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setPositions,
  setSelectedPosition,
  setPositionName,
  setError,
  setSuccess,
  deletePosition,
  updatePosition,
  resetPositionState,
} from "../../store/slices/positionSlice";
import {
  fetchPositionsApi,
  deletePositionApi,
  updatePositionApi,
} from "../../services/positionService";
import { motion } from "framer-motion";
import { RootState } from "../../store/store"; // Assuming you have defined RootState in your store

interface Position {
  positionId: number;
  positionName: string;
}

const PositionList: React.FC = () => {
  const dispatch = useDispatch();
  const {
    positions,
    selectedPosition,
    positionName,
    error,
    success,
  } = useSelector((state: RootState) => state.position);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const data = await fetchPositionsApi();
        dispatch(setPositions(data));
      } catch (err) {
        console.error("Error fetching positions:", err);
        dispatch(setError("Failed to fetch positions."));
      }
    };

    fetchPositions();
  }, [dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await deletePositionApi(id);
      dispatch(deletePosition(id));
      dispatch(setSuccess(`Position with ID ${id} deleted successfully.`));
      dispatch(setError(null));
    } catch (err) {
      console.error("Error deleting position:", err);
      dispatch(setError("Failed to delete the position."));
      dispatch(setSuccess(null));
    }
  };

  const handleEdit = (position: Position) => {
    dispatch(setSelectedPosition(position));
    dispatch(setPositionName(position.positionName));
  };

  const handleUpdate = async () => {
    if (!selectedPosition) return;
    try {
      await updatePositionApi(
        selectedPosition.positionId,
        positionName
      );
      dispatch(
        updatePosition({
          positionId: selectedPosition.positionId,
          positionName: positionName,
        })
      );
      dispatch(
        setSuccess(
          `Position with ID ${selectedPosition.positionId} updated successfully.`
        )
      );
      dispatch(setError(null));
      dispatch(resetPositionState());
    } catch (err) {
      console.error("Error updating position:", err);
      dispatch(setError("Failed to update the position."));
      dispatch(setSuccess(null));
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-900">
      <motion.div
        className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Manage Positions
        </h2>
        {error && <div className="text-red-500 text-center">{error}</div>}
        {success && <div className="text-green-500 text-center">{success}</div>}
        <div className="max-h-96 overflow-y-auto">
          <ul className="space-y-3">
            {positions.map((position: Position) => (
              <motion.li
                key={position.positionId}
                className="flex justify-between items-center bg-gray-700 p-4 rounded-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="text-white">{position.positionName}</span>
                <div>
                  <motion.button
                    onClick={() => handleEdit(position)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg mr-2 transition duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    Edit
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(position.positionId)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg transition duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>

        {selectedPosition && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-xl text-white mb-4">
              Edit Position: {selectedPosition.positionName}
            </h3>
            <input
              type="text"
              value={positionName}
              onChange={(e) => dispatch(setPositionName(e.target.value))}
              className="w-full p-2 mb-4 border border-gray-600 rounded-lg bg-gray-600 text-white"
            />
            <div className="flex justify-end">
              <motion.button
                onClick={handleUpdate}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg mr-2"
                whileHover={{ scale: 1.05 }}
              >
                Update
              </motion.button>
              <motion.button
                onClick={() => dispatch(resetPositionState())}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                Cancel
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default PositionList;
