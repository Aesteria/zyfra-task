import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Department } from '../../types/department';
import { Employe } from '../../types/staff';

type AddNewEmployeQuery = Omit<Employe, 'id'>;

export const apiSlice = createApi({
  reducerPath: 'api',
  tagTypes: ['Employe', 'Department'],
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3004' }),
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => '/departments',
      providesTags: ['Department'],
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
    getEmployeById: builder.query<Employe, string>({
      query: (id) => `/staff/${id}`,
      providesTags: ['Employe'],
    }),
    removeEmployee: builder.mutation({
      query: (id: string) => ({
        url: `/staff/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Employe'],
    }),
    editEmployee: builder.mutation({
      query: (employe: Employe) => ({
        url: `/staff/${employe.id}`,
        method: 'PUT',
        body: employe,
      }),
      invalidatesTags: ['Employe'],
    }),
    editDepartment: builder.mutation({
      query: (department: Department) => ({
        url: `/departments/${department.id}`,
        method: 'PUT',
        body: department,
      }),
      invalidatesTags: ['Department'],
    }),
    addDepartment: builder.mutation({
      query: (department: Omit<Department, 'id'>) => ({
        url: `/departments/`,
        method: 'POST',
        body: department,
      }),
      invalidatesTags: ['Department'],
    }),
    getDepartmentById: builder.query<Department, string>({
      query: (id) => `/departments/${id}`,
      providesTags: ['Department'],
    }),
    removeDepartment: builder.mutation({
      query: (id: string) => ({
        url: `/departments/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Department', 'Employe'],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useGetStaffQuery,
  useAddNewEmployeMutation,
  useRemoveEmployeeMutation,
  useEditEmployeeMutation,
  useGetEmployeByIdQuery,
  useAddDepartmentMutation,
  useRemoveDepartmentMutation,
  useGetDepartmentByIdQuery,
  useEditDepartmentMutation,
} = apiSlice;
