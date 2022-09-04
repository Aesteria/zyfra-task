import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Department } from '../../types/department';
import { Employe } from '../../types/staff';

type AddNewEmployeQuery = Omit<Employe, 'id'>;

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Employe'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3000' }),
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => '/departments',
    }),
    getStaff: builder.query<Employe[], void>({
      query: () => `/staff`,
      providesTags: ['Employe'],
    }),
    addNewEmploye: builder.mutation({
      query: (employe: AddNewEmployeQuery) => ({
        url: '/staff',
        method: 'POST',
        body: employe,
      }),
      invalidatesTags: ['Employe'],
    }),
    removeEmployee: builder.mutation({
      query: (id: number) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employe'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetStaffQuery,
  useAddNewEmployeMutation,
  useRemoveEmployeeMutation,
} = apiSlice;
