import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQuery } from "../../app/baseQuery.ts"

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery,
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { username: string; password: string }) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    getMe: builder.query({
      query: () => 'me',
    }),
  }),
});

// Export hooks for usage in components
export const { useLoginMutation, useGetMeQuery } = authApi;
