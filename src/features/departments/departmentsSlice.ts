import { createSlice } from '@reduxjs/toolkit';

type State = {
  selected: null | string;
};

const initialState: State = {
  selected: null,
};

const departmentsSlice = createSlice({
  name: 'departments',
  initialState,
  reducers: {
    selectDepartment(state: State, { payload }: { payload: string | null }) {
      state.selected = payload;
    },
  },
});

export const { selectDepartment } = departmentsSlice.actions;

export default departmentsSlice.reducer;
