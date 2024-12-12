import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Position {
  positionId: number;
  positionName: string;
}

interface PositionState {
  positions: Position[]; // List of positions
  positionName: string; // Name for creating/updating positions
  error: string | null;
  success: string | null;
  selectedPosition: Position | null; // Position selected for editing
}

const initialState: PositionState = {
  positions: [],
  positionName: "",
  error: null,
  success: null,
  selectedPosition: null,
};

const positionSlice = createSlice({
  name: "position",
  initialState,
  reducers: {
    setPositions: (state, action: PayloadAction<Position[]>) => {
      state.positions = action.payload;
    },
    setPositionName: (state, action: PayloadAction<string>) => {
      state.positionName = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setSuccess: (state, action: PayloadAction<string | null>) => {
      state.success = action.payload;
    },
    setSelectedPosition: (state, action: PayloadAction<Position | null>) => {
      state.selectedPosition = action.payload;
    },
    deletePosition: (state, action: PayloadAction<number>) => {
      state.positions = state.positions.filter(
        (position) => position.positionId !== action.payload
      );
    },
    updatePosition: (state, action: PayloadAction<Position>) => {
      state.positions = state.positions.map((position) =>
        position.positionId === action.payload.positionId
          ? { ...position, positionName: action.payload.positionName }
          : position
      );
    },
    resetPositionState: (state) => {
      state.positionName = "";
      state.error = null;
      state.success = null;
      state.selectedPosition = null;
    },
  },
});

export const {
  setPositions,
  setPositionName,
  setError,
  setSuccess,
  setSelectedPosition,
  deletePosition,
  updatePosition,
  resetPositionState,
} = positionSlice.actions;

export default positionSlice.reducer;
