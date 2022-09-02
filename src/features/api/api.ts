import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Department } from '../../types/department';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getDepartments: builder.query<Department, void>({
      query: () => '/departments',
    }),
  }),
});

export const { useGetDepartmentsQuery } = apiSlice;
