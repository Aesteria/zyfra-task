import { createSlice } from '@reduxjs/toolkit';

type DepartmentsState = {
  selected: number | null;
};

type SelectActiveDepartmentAction = {
  payload: number;
};

const initialState: DepartmentsState = {
  selected: null,
};

export const departmentsSlice = createSlice({
  name: 'departments',
  initialState: initialState,
  reducers: {
    selectActiveDepartment(
      state: DepartmentsState,
      action: SelectActiveDepartmentAction
    ) {
      state.selected = action.payload;
    },
  },
});

export const { selectActiveDepartment } = departmentsSlice.actions;

export default departmentsSlice.reducer;
