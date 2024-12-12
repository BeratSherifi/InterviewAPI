import api from '../../services/api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchQuizzes,
  fetchPositions,
  fetchQuizDetails,
  deleteQuiz,
  fetchUserMap,
  fetchQuestionDetails,
  submitQuizReview,
} from '../../services/quizService';

// Interfaces for state
interface UserAnswer {
  userAnswerId: number;
  questionId: number;
  choiceId: number | null;
  answerText: string | null;
  practicalScore: number | null;
}

interface QuizDetails {
  quizId: number;
  userAnswers: UserAnswer[];
}

interface Quiz {
  quizId: number;
  userId: string;
  positionId: number;
  totalScore: number;
  passed: boolean;
  controlled: boolean;
}

interface QuestionDetails {
  questionId: number;
  text: string;
  questionType: 'Theoretical' | 'Practical';
  choices: {
    choiceId: number;
    text: string;
    isCorrect: boolean;
  }[];
}

interface QuizState {
  quizzes: Quiz[];
  positions: { positionId: number; positionName: string }[];
  selectedQuiz: QuizDetails | null;
  answers: UserAnswer[];
  answerScores: { [key: number]: number };
  questionDetails: { [key: number]: QuestionDetails };
  userMap: { [key: string]: string };
  loading: boolean;
  success: string | null;
  error: string | null;
  quizId: number | null;
  questions: QuestionDetails[] | null;
}

// Initial state
const initialState: QuizState = {
  quizzes: [],
  positions: [],
  selectedQuiz: null,
  answers: [],
  answerScores: {},
  questionDetails: {},
  userMap: {},
  loading: false,
  success: null,
  error: null,
  quizId: null,
  questions: null,
};

// Thunks
export const fetchQuizDetailsThunk = createAsyncThunk(
  'quiz/fetchQuizDetails',
  async ({ quizId, token }: { quizId: number; token: string }, { rejectWithValue, dispatch }) => {
    try {
      const quizDetails = await fetchQuizDetails(quizId, token);
      // Fetch question details for each answer
      for (const answer of quizDetails.userAnswers) {
        dispatch(fetchQuestionDetailsThunk({ questionId: answer.questionId, token }));
      }
      return quizDetails;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);


export const fetchQuizzesThunk = createAsyncThunk(
  'quiz/fetchQuizzes',
  async (token: string, { rejectWithValue }) => {
    try {
      return await fetchQuizzes(token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchPositionsThunk = createAsyncThunk(
  'quiz/fetchPositions',
  async (token: string, { rejectWithValue }) => {
    try {
      return await fetchPositions(token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteQuizThunk = createAsyncThunk(
  'quiz/deleteQuiz',
  async ({ quizId, token }: { quizId: number; token: string }, { rejectWithValue }) => {
    try {
      await deleteQuiz(quizId, token);
      return quizId;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserMapThunk = createAsyncThunk(
  'quiz/fetchUserMap',
  async (token: string, { rejectWithValue }) => {
    try {
      return await fetchUserMap(token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchQuestionDetailsThunk = createAsyncThunk(
  'quiz/fetchQuestionDetails',
  async ({ questionId, token }: { questionId: number; token: string }, { rejectWithValue }) => {
    try {
      return await fetchQuestionDetails(questionId, token);
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuizReviewThunk = createAsyncThunk(
  'quiz/submitQuizReview',
  async ({ reviewPayload, token }: { reviewPayload: any; token: string }, { rejectWithValue }) => {
    try {
      await submitQuizReview(reviewPayload, token);
      return 'Review submitted successfully';
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createQuizThunk = createAsyncThunk(
  'quiz/createQuiz',
  async ({ positionId, userId }: { positionId: number; userId: string }, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      const response = await api.post(
        '/api/Quiz',
        { positionId, userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.data; // Should include quizId and questions
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const submitQuizThunk = createAsyncThunk(
  'quiz/submitQuiz',
  async (
    { quizId, answers }: { quizId: number; answers: { questionId: number; choiceId?: number; answerText?: string }[] },
    { rejectWithValue }
  ) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      await api.post(
        '/api/Quiz/submit',
        { quizId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return 'Quiz submitted successfully!';
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    // Clears the success message in the state
    clearSuccess: (state) => {
      state.success = null;
    },
    // Clears the error message in the state
    clearError: (state) => {
      state.error = null;
    },
    // Sets the selected quiz in the state
    setSelectedQuiz: (state, action) => {
      state.selectedQuiz = action.payload;
    },
    // Updates the score for a user's answer
    setAnswerScores: (state, action) => {
      state.answerScores[action.payload.userAnswerId] = action.payload.score;
    },
    // Updates or adds an answer for a question
    setAnswer: (state, action) => {
      const { questionId, choiceId, answerText } = action.payload;
      const existingAnswer = state.answers.find((ans) => ans.questionId === questionId);
  
      if (existingAnswer) {
        // Update the existing answer
        existingAnswer.choiceId = choiceId ?? existingAnswer.choiceId;
        existingAnswer.answerText = answerText ?? existingAnswer.answerText;
      } else {
        // Add a new answer with default values for missing properties
        state.answers.push({
          userAnswerId: Date.now(), // Temporary unique ID for this answer
          questionId,
          choiceId: choiceId ?? null,
          answerText: answerText ?? null,
          practicalScore: null, // Default practicalScore to null
        });
      }
    },
  },
  
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuizzesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizDetailsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizDetailsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedQuiz = action.payload; // Set detailed quiz data
      })
      .addCase(fetchQuizDetailsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPositionsThunk.fulfilled, (state, action) => {
        state.positions = action.payload;
      })
      .addCase(deleteQuizThunk.fulfilled, (state, action) => {
        state.quizzes = state.quizzes.filter((quiz) => quiz.quizId !== action.payload);
        state.success = 'Quiz deleted successfully!';
      })
      .addCase(fetchUserMapThunk.fulfilled, (state, action) => {
        state.userMap = action.payload;
      })
      .addCase(fetchQuestionDetailsThunk.fulfilled, (state, action) => {
        state.questionDetails[action.payload.questionId] = action.payload;
      })
      .addCase(submitQuizReviewThunk.fulfilled, (state, action) => {
        state.success = action.payload;
      })
      .addCase(createQuizThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuizThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.quizId = action.payload.quizId; // Set the created quizId
        state.questions = action.payload.questions; // Set the questions for the created quiz
        state.success = 'Quiz created successfully!';
      })
      .addCase(createQuizThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(submitQuizThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(submitQuizThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload; // Set success message for quiz submission
      })
      .addCase(submitQuizThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSuccess, clearError, setSelectedQuiz, setAnswerScores, setAnswer } = quizSlice.actions;

export default quizSlice.reducer;
