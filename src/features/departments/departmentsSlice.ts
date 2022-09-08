import { createSlice } from '@reduxjs/toolkit';

type State = {
  selected: null | string;
};

const initialState: State = {
  selected: null,
};

const departmentsSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    selectDepartment(state: State, { payload }: { payload: string }) {
      state.selected = payload;
    },
  },
});

export const { selectDepartment } = departmentsSlice.actions;

export default departmentsSlice.reducer;
