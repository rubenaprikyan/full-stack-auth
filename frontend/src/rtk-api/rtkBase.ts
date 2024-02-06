import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const defaultAuthToken =
  'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJzYWx0IjoiMHN0WFNkVmFBQUJrTzJDYllmQUJ0RVZPYW10cFZjRHAiLCJlbWFpbCI6InJ1YmVuYXByaWt5YW4yQGdtYWlsLmNvbSIsImlhdCI6MTcwNzE3ODY2NiwiZXhwIjoxNzA3MjY1MDY2fQ.i5s3CotjqPRRHudEUgl_xrZfPj9aDWGPdI7wOlzgNIr2jTRWgBHIn_60yVE9ECadpkPe2d2k6jY14Cfb1kOq8Q';

const api = createApi({
  reducerPath: 'api',
  refetchOnMountOrArgChange: 30,
  endpoints: () => ({}),
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:4000/api',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('authToken') || defaultAuthToken; // Replace with your selector to get the token from the Redux store
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
});

export default api;
