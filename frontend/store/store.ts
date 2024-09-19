// store.ts
import { configureStore } from '@reduxjs/toolkit';
import todoReducer from './todoSlice';  // Or the appropriate path to your todoSlice

export const store = configureStore({
  reducer: {
    todos: todoReducer,  // Your reducer name
  },
});


export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;