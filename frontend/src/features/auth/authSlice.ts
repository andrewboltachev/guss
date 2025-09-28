import { createSlice } from '@reduxjs/toolkit';
import { authApi } from "./authApi.ts"
import Cookies from "js-cookie";

interface AuthPayload {
  access_token: string;
  username: string;
}

interface AuthState {
  username: string | undefined;
  token: string | undefined;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  username: Cookies.get('username'),
  token: Cookies.get('token'),
  isAuthenticated: !!Cookies.get('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.username = undefined;
      state.token = undefined;
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
        Cookies.set("username", payload.username)
      },
    )
  },
});

export const { logout } = authSlice.actions;
export default authSlice;
