import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../types/apiSchemas';

export interface UserState {
  user: null | User;
  token: string | null;
  isAuthenticated: boolean | null;
  defaultFamilyId: string | null;
}

const initialState: UserState = {
  user: null,
  token: null,
  isAuthenticated: null,
  defaultFamilyId: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    loginSuccess(state, action: PayloadAction<{ token: string }>) {
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    setUser(state, action: PayloadAction<{ user: UserState['user'] }>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
    },
    setDefaultFamilyId(
      state,
      action: PayloadAction<{ defaultFamilyId: string }>
    ) {
      state.defaultFamilyId = action.payload.defaultFamilyId;
    },
    reset: () => initialState, // to test
  },
});

export const { loginSuccess, setUser, setDefaultFamilyId, reset } =
  userSlice.actions;
export default userSlice.reducer;
