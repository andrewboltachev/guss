import { createSlice } from '@reduxjs/toolkit';
import { authApi } from "./authApi.ts"

const initialState = {
  user: null,
  token: localStorage.getItem('token') ?? null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }) => {
        // Assuming the backend returns { token: "...", user: {...} }
        state.token = payload.token;
        state.user = payload.user;
        state.isAuthenticated = true;

        // 🔑 Persist the token (MOST CRITICAL STEP)
        localStorage.setItem('token', payload.token);
        localStorage.setItem('user', JSON.stringify(payload.user));
      }
    );
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
