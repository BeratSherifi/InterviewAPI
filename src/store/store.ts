import { configureStore } from '@reduxjs/toolkit';
import quizReducer from './slices/quizSlice'; 
import analyticsReducer from './slices/analyticsSlice';
import rolesReducer from './slices/roleSlice'
import userReducer from './slices/userSlice'
import questionReducer from './slices/questionSlice'
import authReducer from './slices/authSlice'
import positonReducer from './slices/positionSlice'

const store = configureStore({
  reducer: {
    quiz: quizReducer,
    analytics: analyticsReducer,
    role: rolesReducer,
    user: userReducer,
    question: questionReducer,
    auth: authReducer,
    position: positonReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store; // Ensure the store is exported as the default
