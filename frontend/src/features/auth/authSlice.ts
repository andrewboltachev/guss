import { createSlice } from '@reduxjs/toolkit';
import { authApi } from "./authApi.ts"
import Cookies from "js-cookie";

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
  username: Cookies.get('username'),
  token: Cookies.get('token') ?? null,
  isAuthenticated: !!Cookies.get('token'),
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
      localStorage.removeItem('username');
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, { payload }: { payload: AuthPayload }) => {
        state.token = payload.access_token
        state.username = payload.username
        state.isAuthenticated = true

        Cookies.set("token", payload.access_token)
      },
    )
  },
});

export const { logout } = authSlice.actions;
export default authSlice;
