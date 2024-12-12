import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  fetchQuestions,
  fetchPositions,
  deleteQuestion,
  createQuestion,
} from "../../services/questionService";

// Interfaces
interface Choice {
  choiceId?: number;
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

interface QuestionState {
  questions: Question[];
  filteredQuestions: Question[];
  positions: Position[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial State
const initialState: QuestionState = {
  questions: [],
  filteredQuestions: [],
  positions: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks
export const fetchQuestionsThunk = createAsyncThunk(
  "question/fetchQuestions",
  async (token: string, { rejectWithValue }) => {
    try {
      const questions = await fetchQuestions(token);
      return questions;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch questions");
    }
  }
);

export const fetchPositionsThunk = createAsyncThunk(
  "question/fetchPositions",
  async (token: string, { rejectWithValue }) => {
    try {
      const positions = await fetchPositions(token);
      return positions;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch positions");
    }
  }
);

export const deleteQuestionThunk = createAsyncThunk(
  "question/deleteQuestion",
  async (questionId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      await deleteQuestion(questionId, token);
      return questionId;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete question");
    }
  }
);

export const createQuestionThunk = createAsyncThunk(
  "question/createQuestion",
  async (
    {
      text,
      difficultyLevel,
      questionType,
      positionId,
      choices,
    }: {
      text: string;
      difficultyLevel: number;
      questionType: string;
      positionId: number;
      choices: Choice[];
    },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");
      await createQuestion(
        {
          text,
          difficultyLevel,
          questionType,
          positionId,
          choices,
        },
        token
      );
      return "Question created successfully!";
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create question");
    }
  }
);

// Slice
const questionSlice = createSlice({
  name: "question",
  initialState,
  reducers: {
    setFilteredQuestions: (state, action) => {
      state.filteredQuestions = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.filteredQuestions = action.payload; // Initialize filteredQuestions
      })
      .addCase(fetchQuestionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch Positions
      .addCase(fetchPositionsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPositionsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.positions = action.payload;
      })
      .addCase(fetchPositionsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete Question
      .addCase(deleteQuestionThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuestionThunk.fulfilled, (state, action) => {
        state.loading = false;
        const questionId = action.payload;
        state.questions = state.questions.filter(
          (q) => q.questionId !== questionId
        );
        state.filteredQuestions = state.filteredQuestions.filter(
          (q) => q.questionId !== questionId
        );
      })
      .addCase(deleteQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Question
      .addCase(createQuestionThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createQuestionThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload as string;
      })
      .addCase(createQuestionThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { setFilteredQuestions, clearError, clearSuccessMessage } =
  questionSlice.actions;

// Reducer
export default questionSlice.reducer;
