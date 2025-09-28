import { fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3000/',
  prepareHeaders: (headers ) => {
    const token: string | null = localStorage.getItem('token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});
