import { configureStore } from '@reduxjs/toolkit';
import aiKeyReducer from '../slices/aiKey.slice';

export const reduxStore = configureStore({
  reducer: {
    aiKey: aiKeyReducer,
  },
});

export type RootState = ReturnType<typeof reduxStore.getState>;
export type AppDispatch = typeof reduxStore.dispatch;
