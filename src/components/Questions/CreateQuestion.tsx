import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { fetchPositionsThunk, createQuestionThunk } from "../../store/slices/questionSlice";
import { motion } from "framer-motion";

const CreateQuestion: React.FC = () => {
  const dispatch: AppDispatch = useDispatch();
  const { positions, error, successMessage } = useSelector((state: RootState) => state.question);

  const [text, setText] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [questionType, setQuestionType] = useState("Theoretical");
  const [positionId, setPositionId] = useState<number | null>(null);
  const [choices, setChoices] = useState([{ text: "", isCorrect: false }]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      dispatch(fetchPositionsThunk(token));
    } else {
      console.error("No token found");
    }
  }, [dispatch]);

  const handleAddChoice = () => {
    setChoices([...choices, { text: "", isCorrect: false }]);
  };

  const handleChoiceChange = (index: number, field: string, value: string | boolean) => {
    const updatedChoices = [...choices];
    if (field === "text") {
      updatedChoices[index].text = value as string;
    } else if (field === "isCorrect") {
      updatedChoices[index].isCorrect = value as boolean;
    }
    setChoices(updatedChoices);
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !positionId) {
      console.error("No token found or no position selected.");
      return;
    }
  
    dispatch(
      createQuestionThunk({
        text,
        difficultyLevel,
        questionType,
        positionId,
        choices: questionType === "Theoretical"
          ? choices.map((choice, index) => ({
              ...choice,
              choiceId: index + 1, // Assign temporary IDs for new choices
            }))
          : [],
      })
    );
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <motion.div
        className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl text-white font-bold mb-6 text-center">Create Question</h1>

        {error && <div className="text-red-500 mb-4 text-center">{error}</div>}
        {successMessage && <div className="text-green-500 mb-4 text-center">{successMessage}</div>}

        <input
          type="text"
          placeholder="Question Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <select
          value={questionType}
          onChange={(e) => setQuestionType(e.target.value)}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        >
          <option value="Theoretical">Theoretical</option>
          <option value="Practical">Practical</option>
        </select>

        <input
          type="number"
          min="1"
          max="5"
          placeholder="Difficulty Level (1-5)"
          value={difficultyLevel}
          onChange={(e) => setDifficultyLevel(Math.max(1, Math.min(5, parseInt(e.target.value))))}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        />

        <select
          value={positionId || ""}
          onChange={(e) => setPositionId(Number(e.target.value))}
          className="w-full p-3 mb-4 border border-gray-700 rounded-lg bg-gray-700 text-white"
        >
          <option value="">Select Position</option>
          {positions.map((position) => (
            <option key={position.positionId} value={position.positionId}>
              {position.positionName}
            </option>
          ))}
        </select>

        {questionType === "Theoretical" && (
          <>
            <h3 className="text-white mb-2">Choices</h3>
            {choices.map((choice, index) => (
              <div key={index} className="mb-4">
                <input
                  type="text"
                  placeholder="Choice Text"
                  value={choice.text}
                  onChange={(e) => handleChoiceChange(index, "text", e.target.value)}
                  className="w-full p-3 mb-2 border border-gray-700 rounded-lg bg-gray-700 text-white"
                />
                <label className="text-white flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={choice.isCorrect}
                    onChange={(e) => handleChoiceChange(index, "isCorrect", e.target.checked)}
                    className="mr-2"
                  />
                  <span>Is Correct</span>
                </label>
              </div>
            ))}
            <motion.button
              onClick={handleAddChoice}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold mb-4"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Add Choice
            </motion.button>
          </>
        )}

        <motion.button
          onClick={handleSubmit}
          className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Create Question
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CreateQuestion;
