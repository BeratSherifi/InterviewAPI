import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  email: string;
  password: string;
  confirmPassword: string;
  error: string | null;
  success: string | null;
  isLoggingIn: boolean;
  isRegistering: boolean;
  savedEmails: string[];
  showSuggestions: boolean;
}

const initialState: AuthState = {
  email: '',
  password: '',
  confirmPassword: '',
  error: null,
  success: null,
  isLoggingIn: false,
  isRegistering: false,
  savedEmails: [],
  showSuggestions: false,
};

const parseJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing token:", error);
    return null;
  }
};

const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const decoded = parseJwt(token);
  if (decoded && decoded.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    return currentTime >= decoded.exp;
  }
  return true;
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload;
      state.showSuggestions = true;
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload;
    },
    setConfirmPassword: (state, action: PayloadAction<string>) => {
      state.confirmPassword = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    setSavedEmails: (state, action: PayloadAction<string[]>) => {
      state.savedEmails = action.payload;
    },
    setShowSuggestions: (state, action: PayloadAction<boolean>) => {
      state.showSuggestions = action.payload;
    },
    setIsLoggingIn: (state, action: PayloadAction<boolean>) => {
      state.isLoggingIn = action.payload;
    },
    setIsRegistering: (state, action: PayloadAction<boolean>) => {
      state.isRegistering = action.payload;
    },
    addSavedEmail: (state, action: PayloadAction<string>) => {
      if (!state.savedEmails.includes(action.payload)) {
        state.savedEmails.push(action.payload);
      }
    },
    handleTokenStorage: (state, action: PayloadAction<string>) => {
      const token = action.payload;
      localStorage.setItem("token", token);

      const savedEmails = JSON.parse(localStorage.getItem("savedEmails") || "[]");
      if (!savedEmails.includes(state.email)) {
        savedEmails.push(state.email);
        localStorage.setItem("savedEmails", JSON.stringify(savedEmails));
        state.savedEmails = savedEmails;
      }
    },
    resetAuth: (state) => {
      state.email = '';
      state.password = '';
      state.confirmPassword = '';
      state.error = null;
      state.success = null;
      state.isLoggingIn = false;
      state.isRegistering = false;
      state.savedEmails = [];
      state.showSuggestions = false;
    },
    handleLogout: (state) => {
      state.email = '';
      state.password = '';
      state.confirmPassword = '';
      state.error = null;
      state.success = null;
      state.isLoggingIn = false;
      state.isRegistering = false;
      state.savedEmails = [];
      state.showSuggestions = false;
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
    },
    setAuthenticating: (state, action: PayloadAction<boolean>) => {
      state.isLoggingIn = action.payload; // Use isLoggingIn as a proxy for authenticating
    },
    clearSavedEmails: (state) => {
      state.savedEmails = [];
      localStorage.removeItem("savedEmails");
    },
  },
});

export const {
  setEmail,
  setPassword,
  setConfirmPassword,
  setError,
  setSuccess,
  setSavedEmails,
  setShowSuggestions,
  setIsLoggingIn,
  setIsRegistering,
  addSavedEmail,
  handleTokenStorage,
  resetAuth,
  handleLogout,
  setAuthenticating,
  clearSavedEmails,
} = authSlice.actions;

export default authSlice.reducer;
export { parseJwt, isTokenExpired };
