import { createSlice } from '@reduxjs/toolkit';
import { Employe } from '../../types/staff';

type State = {
  currentDragEmploye: null | Employe;
};

const initialState: State = {
  currentDragEmploye: null,
};

const staffSlice = createSlice({
  name: 'staff',
  initialState,
  reducers: {
    changeDragEmploye(state: State, { payload }: { payload: Employe | null }) {
      state.currentDragEmploye = payload;
    },
  },
});

export const { changeDragEmploye } = staffSlice.actions;

export default staffSlice.reducer;
