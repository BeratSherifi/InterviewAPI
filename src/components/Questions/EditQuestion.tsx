import React from 'react';

interface Choice {
  choiceId: number;
  text: string;
  isCorrect: boolean;
}

interface Question {
  questionId: number;
  text: string;
  difficultyLevel: number;
  questionType: string;
  positionId: number;
  choices: Choice[];
}

interface Position {
  positionId: number;
  positionName: string;
}

interface EditQuestionProps {
  question: Question;
  positions: Position[];
  onSave: (questionId: number, updatedQuestion: Question) => Promise<void>;
  onCancel: () => void;
}

const EditQuestion: React.FC<EditQuestionProps> = ({ question, positions, onSave, onCancel }) => {
  const [editedQuestion, setEditedQuestion] = React.useState<Question>(question);

  const handleChoiceChange = (index: number, field: string, value: string | boolean) => {
    const updatedChoices = [...editedQuestion.choices];
    if (field === 'text') {
      updatedChoices[index].text = value as string;
    } else if (field === 'isCorrect') {
      updatedChoices[index].isCorrect = value as boolean;
    }
    setEditedQuestion((prev) => ({ ...prev, choices: updatedChoices }));
  };

  const handleSubmit = async () => {
    await onSave(question.questionId, editedQuestion);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg w-full max-w-3xl mx-auto">
      <input
        className="text-black p-2 mb-4 w-full rounded"
        type="text"
        value={editedQuestion.text}
        onChange={(e) => setEditedQuestion((prev) => ({ ...prev, text: e.target.value }))}
      />
      <input
        className="text-black p-2 mb-4 w-full rounded"
        type="number"
        value={editedQuestion.difficultyLevel}
        onChange={(e) => setEditedQuestion((prev) => ({ ...prev, difficultyLevel: parseInt(e.target.value) }))}
      />
      <select
        className="text-black p-2 mb-4 w-full rounded"
        value={editedQuestion.questionType}
        onChange={(e) => setEditedQuestion((prev) => ({ ...prev, questionType: e.target.value }))}
      >
        <option value="Theoretical">Theoretical</option>
        <option value="Practical">Practical</option>
      </select>
      <select
        className="text-black p-2 mb-4 w-full rounded"
        value={editedQuestion.positionId || ''}
        onChange={(e) => setEditedQuestion((prev) => ({ ...prev, positionId: Number(e.target.value) }))}
      >
        <option value="">Select Position</option>
        {positions.map((position) => (
          <option key={position.positionId} value={position.positionId}>
            {position.positionName}
          </option>
        ))}
      </select>
      <div className="mb-4">
        {editedQuestion.choices.map((choice, index) => (
          <div key={choice.choiceId} className="mb-4">
            <input
              className="text-black p-2 mb-2 w-full rounded"
              type="text"
              value={choice.text}
              onChange={(e) => handleChoiceChange(index, 'text', e.target.value)}
            />
            <label className="text-white flex items-center">
              <input
                type="checkbox"
                checked={choice.isCorrect}
                onChange={(e) => handleChoiceChange(index, 'isCorrect', e.target.checked)}
                className="mr-2"
              />
              Correct
            </label>
          </div>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded-lg mr-2"
      >
        Save
      </button>
      <button
        onClick={onCancel}
        className="bg-gray-500 text-white px-4 py-2 rounded-lg"
      >
        Cancel
      </button>
    </div>
  );
};

export default EditQuestion;
