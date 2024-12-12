import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { assignRole, createRole } from '../../services/roleService';

interface RoleState {
  loading: boolean;
  success: string | null;
  error: string | null;
}

const initialState: RoleState = {
  loading: false,
  success: null,
  error: null,
};

// Thunks
export const assignRoleThunk = createAsyncThunk(
  'role/assignRole',
  async ({ username, roleName }: { username: string; roleName: string }, { rejectWithValue }) => {
    try {
      return await assignRole(username, roleName);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to assign role.');
    }
  }
);

export const createRoleThunk = createAsyncThunk(
  'role/createRole',
  async (roleName: string, { rejectWithValue }) => {
    try {
      return await createRole(roleName);
    } catch (error: any) {
      return rejectWithValue(error.message || 'Failed to create role.');
    }
  }
);

const roleSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    clearRoleState: (state) => {
      state.success = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Assign Role
      .addCase(assignRoleThunk.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(assignRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(assignRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create Role
      .addCase(createRoleThunk.pending, (state) => {
        state.loading = true;
        state.success = null;
        state.error = null;
      })
      .addCase(createRoleThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.success = action.payload;
      })
      .addCase(createRoleThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRoleState } = roleSlice.actions;

export default roleSlice.reducer;
