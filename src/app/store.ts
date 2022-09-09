import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import { apiSlice } from '../features/api/api';
import departmentsReducer from '../features/departments/departmentsSlice';
import staffReducer from '../features/staff/staffSlice';

export const store = configureStore({
  reducer: {
    departments: departmentsReducer,
    staff: staffReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
