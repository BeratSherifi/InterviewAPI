import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchPositions,
  fetchAverageScore,
  fetchFailedQuizzes,
  fetchPassedQuizzes,
  fetchHighestQuizScore,
  fetchLowestQuizScore,
  fetchLowestScores,
  fetchUserIdByEmail,
  fetchTopScoresByUserId,
  fetchTopScores,
} from '../../services/analyticsService';

// Interfaces
interface Position {
  positionId: number;
  positionName: string;
}

interface AverageScore {
  positionId: number;
  averageScore: number;
}

interface QuizScore {
  quizId: number;
  userId: string;
  totalScore: number;
  passed: boolean;
  controlled: boolean;
}

interface FailedQuiz {
  quizId: number;
  userId: string;
  totalScore: number;
}

interface AnalyticsState {
  positions: Position[];
  averageScore: AverageScore | null;
  failedQuizzes: FailedQuiz[];
  passedQuizzes: QuizScore[];
  highestQuizScore: QuizScore | null;
  topScores: QuizScore[];
  lowestQuizScore: QuizScore | null;
  lowestScores: QuizScore[];
  userResults: QuizScore[];
  loading: boolean;
  error: string | null;
}

// Initial State
const initialState: AnalyticsState = {
  positions: [],
  averageScore: null,
  failedQuizzes: [],
  passedQuizzes: [],
  topScores: [],
  highestQuizScore: null,
  lowestQuizScore: null,
  lowestScores: [],
  userResults: [],
  loading: false,
  error: null,
};

// Thunks
export const fetchPositionsThunk = createAsyncThunk(
  'analytics/fetchPositions',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchPositions(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch positions');
    }
  }
);

export const fetchAverageScoreThunk = createAsyncThunk(
  'analytics/fetchAverageScore',
  async (positionId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      const averageScore = await fetchAverageScore(positionId, token);
      return { positionId, averageScore };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 500
          ? 'No quizzes available for this position'
          : 'Failed to fetch average score'
      );
    }
  }
);

export const fetchFailedQuizzesThunk = createAsyncThunk(
  'analytics/fetchFailedQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchFailedQuizzes(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch failed quizzes');
    }
  }
);

export const fetchPassedQuizzesThunk = createAsyncThunk(
  'analytics/fetchPassedQuizzes',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchPassedQuizzes(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch passed quizzes');
    }
  }
);

export const fetchHighestQuizScoreThunk = createAsyncThunk(
  'analytics/fetchHighestQuizScore',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchHighestQuizScore(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch highest quiz score');
    }
  }
);

export const fetchLowestQuizScoreThunk = createAsyncThunk(
  'analytics/fetchLowestQuizScore',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchLowestQuizScore(token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch lowest quiz score');
    }
  }
);

export const fetchLowestScoresThunk = createAsyncThunk(
  'analytics/fetchLowestScores',
  async (positionId: number, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchLowestScores(positionId, token);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.status === 404
          ? 'No quizzes found for this position'
          : 'Failed to fetch lowest scores'
      );
    }
  }
);

export const fetchUserIdByEmailThunk = createAsyncThunk(
  'analytics/fetchUserIdByEmail',
  async (email: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchUserIdByEmail(email, token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch user ID by email');
    }
  }
);

export const fetchTopScoresByUserIdThunk = createAsyncThunk(
  'analytics/fetchTopScoresByUserId',
  async (userId: string, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Unauthorized');
      return await fetchTopScoresByUserId(userId, token);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to fetch top scores by user ID');
    }
  }
);


export const fetchTopScoresThunk = createAsyncThunk(
    'analytics/fetchTopScores',
    async (positionId: number, { rejectWithValue }) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Unauthorized');
        return await fetchTopScores(positionId, token);
      } catch (error: any) {
        return rejectWithValue(
          error.response?.status === 404
            ? 'No quizzes found for this position'
            : 'Failed to fetch top scores'
        );
      }
    }
  );
  

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearAverageScore: (state) => {
      state.averageScore = null;
    },
    clearFailedQuizzes: (state) => {
      state.failedQuizzes = [];
    },
    clearPassedQuizzes: (state) => {
      state.passedQuizzes = [];
    },
    clearHighestQuizScore: (state) => {
      state.highestQuizScore = null;
    },
    clearLowestQuizScore: (state) => {
      state.lowestQuizScore = null;
    },
    clearLowestScores: (state) => {
      state.lowestScores = [];
    },
    clearUserResults: (state) => {
      state.userResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(fetchAverageScoreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAverageScoreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.averageScore = action.payload;
      })
      .addCase(fetchAverageScoreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchFailedQuizzesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFailedQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.failedQuizzes = action.payload;
      })
      .addCase(fetchFailedQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPassedQuizzesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPassedQuizzesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.passedQuizzes = action.payload;
      })
      .addCase(fetchPassedQuizzesThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchHighestQuizScoreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHighestQuizScoreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.highestQuizScore = action.payload;
      })
      .addCase(fetchHighestQuizScoreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLowestQuizScoreThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowestQuizScoreThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lowestQuizScore = action.payload;
      })
      .addCase(fetchLowestQuizScoreThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchLowestScoresThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLowestScoresThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.lowestScores = action.payload;
      })
      .addCase(fetchLowestScoresThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserIdByEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserIdByEmailThunk.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(fetchUserIdByEmailThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTopScoresByUserIdThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopScoresByUserIdThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userResults = action.payload;
      })
      .addCase(fetchTopScoresByUserIdThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch Top Scores
.addCase(fetchTopScoresThunk.pending, (state) => {
    state.loading = true;
    state.error = null;
  })
  .addCase(fetchTopScoresThunk.fulfilled, (state, action) => {
    state.loading = false;
    state.topScores = action.payload;
  })
  .addCase(fetchTopScoresThunk.rejected, (state, action) => {
    state.loading = false;
    state.error = action.payload as string;
  });
  
      
  },
});

// Actions
export const {
  clearError,
  clearAverageScore,
  clearFailedQuizzes,
  clearPassedQuizzes,
  clearHighestQuizScore,
  clearLowestQuizScore,
  clearLowestScores,
  clearUserResults,
} = analyticsSlice.actions;

// Reducer
export default analyticsSlice.reducer;
