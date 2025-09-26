import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './../../app/store';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3000/',
    prepareHeaders: (headers, { getState: () => RootState() }) => {
      const token: string | null = (
        getState().auth.token
        ?? localStorage.getItem('token')
      );

      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getProfile: builder.query({
      query: () => 'users/profile', // e.g., GET /users/profile
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useGetProfileQuery } = authApi;
