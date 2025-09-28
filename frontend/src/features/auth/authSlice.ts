import { createSlice } from '@reduxjs/toolkit';
import { authApi } from "./authApi.ts"

interface AuthPayload {
  access_token: string;
  username: string;
}

interface AuthState {
  username: string | null;
  token: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: null,
  token: localStorage.getItem('token') ?? null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = null;
      state.token = null;
      state.isAuthenticated = false;

      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: { payload: AuthPayload }) => {
        state.token = payload.access_token
        state.username = payload.username
        state.isAuthenticated = true

        localStorage.setItem("token", payload.access_token)
      },
    )
  },
});

export const { logout } = authSlice.actions;
export default authSlice;
