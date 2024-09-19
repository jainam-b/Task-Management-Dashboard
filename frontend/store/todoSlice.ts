// store/todoSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../app/api/task';

export enum TodoStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Done = 'Done'
}

export enum TodoPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Todo {
  _id: any;
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  completed: boolean;
}

export const getTodos = createAsyncThunk('todos/getTodos', async () => {
  const todos = await fetchTodos();
  return todos;
});

export const addTodo = createAsyncThunk('todos/addTodo', async (todo: Omit<Todo, 'id'>) => {
  const newTodo = await createTodo(todo);
  return newTodo;
});

export const updateTodos = createAsyncThunk('todos/updateTodos', async (todo: Todo) => {
  const updatedTodo = await updateTodo(todo);
  return updatedTodo;
});

export const removeTodo = createAsyncThunk('todos/removeTodo', async (id: string) => {
  await deleteTodo(id);
  return id;
});

export const toggleTodo = createAsyncThunk('todos/toggleTodo', async (todo: Todo) => {
  const updatedTodo = await updateTodo({ ...todo, completed: !todo.completed });
  return updatedTodo;
});

interface TodoState {
  todos: Todo[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  todos: [],
  status: 'idle',
  error: null
};

const todoSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTodos.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getTodos.fulfilled, (state, action: PayloadAction<Todo[]>) => {
        state.status = 'succeeded';
        state.todos = action.payload;
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch todos';
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.todos.push(action.payload);
      })
      .addCase(updateTodos.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) state.todos[index] = action.payload;
      })
      .addCase(removeTodo.fulfilled, (state, action: PayloadAction<string>) => {
        state.todos = state.todos.filter((todo) => todo._id !== action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        const index = state.todos.findIndex(todo => todo.id === action.payload.id);
        if (index !== -1) state.todos[index] = action.payload;
      });
  },
});

export default todoSlice.reducer;