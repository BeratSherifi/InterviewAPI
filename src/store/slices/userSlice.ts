import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchUsers,
  fetchQuizResultsByUserId,
  fetchQuestionDetailsById,
  deleteUser, // Ensure deleteUser is defined in your service
} from '../../services/userService';

// Interfaces
interface UserAnswer {
  userAnswerId: number;
  questionId: number;
  choiceId: number | null;
  answerText: string | null;
  question?: any; // Add question details
  chosenAnswer?: string; // Add chosen answer
}

interface QuizResult {
  quizId: number;
  totalScore: number;
  passed: boolean;
  message?: string;
  comment?: string;
  userAnswers: UserAnswer[];
}

interface UserState {
  users: any[];  // Replace with your User model or interface
  userResults: QuizResult[];  // Quiz results
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: UserState = {
  users: [],
  userResults: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchUsersThunk = createAsyncThunk(
  'user/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchUsers(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch users');
    }
  }
);

export const fetchQuizResultsThunk = createAsyncThunk(
  'user/fetchQuizResults',
  async (userId: string, { rejectWithValue, dispatch }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');

      const quizResults = await fetchQuizResultsByUserId(userId, token);

      const resultsWithQuestions = await Promise.all(
        quizResults.map(async (result: any) => {
          const userAnswersWithQuestions = await Promise.all(
            result.userAnswers.map(async (answer: any) => {
              try {
                const question = await fetchQuestionDetailsById(answer.questionId, token);
                const chosenAnswer =
                  question.choices.find((choice: any) => choice.choiceId === answer.choiceId)
                    ?.text || 'No answer provided';

                return { ...answer, question, chosenAnswer };
              } catch (err) {
                return { ...answer, question: null, chosenAnswer: 'Error loading answer' };
              }
            })
          );
          return { ...result, userAnswers: userAnswersWithQuestions };
        })
      );

      return resultsWithQuestions;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch quiz results');
    }
  }
);

export const deleteUserThunk = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      await deleteUser(userId, token); // Call deleteUser from the service
      return userId; // Return the userId to be used in the reducer
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to delete user');
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearUserResults: (state) => {
      state.userResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch Quiz Results
      .addCase(fetchQuizResultsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuizResultsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userResults = action.payload;
      })
      .addCase(fetchQuizResultsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete User
      .addCase(deleteUserThunk.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteUserThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user.id !== action.payload); // Remove user by id
      })
      .addCase(deleteUserThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// Actions
export const { clearError, clearUserResults } = userSlice.actions;

// Reducer
export default userSlice.reducer;
