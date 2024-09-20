import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../app/api/task';

export enum TodoStatus {
  ToDo = 'To Do',
  InProgress = 'In Progress',
  Completed = 'Completed'
}

export enum TodoPriority {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High'
}

export interface Todo {
  _id: string;
  id: string;
  title: string;
  description?: string;
  status: TodoStatus;
  priority: TodoPriority;
  dueDate?: string;
  completed: boolean;
}

export const getTodos = createAsyncThunk(
  'todos/getTodos',
  async (_, { rejectWithValue }) => {
    try {
      return await fetchTodos();
    } catch (error) {
      return rejectWithValue('Failed to fetch todos');
    }
  }
);

export const addTodo = createAsyncThunk(
  'todos/addTodo',
  async (todo: Omit<Todo, 'id' | '_id'>, { rejectWithValue }) => {
    try {
      return await createTodo(todo);
    } catch (error) {
      return rejectWithValue('Failed to add todo');
    }
  }
);

export const updateTodos = createAsyncThunk(
  'todos/updateTodos',
  async (todo: Todo, { rejectWithValue }) => {
    try {
      return await updateTodo(todo);
    } catch (error) {
      return rejectWithValue('Failed to update todo');
    }
  }
);

export const removeTodo = createAsyncThunk(
  'todos/removeTodo',
  async (id: string, { rejectWithValue }) => {
    try {
      await deleteTodo(id);
      return id;
    } catch (error) {
      return rejectWithValue('Failed to remove todo');
    }
  }
);

export const toggleTodo = createAsyncThunk(
  'todos/toggleTodo',
  async (todo: Todo, { rejectWithValue }) => {
    try {
      return await updateTodo({ ...todo, completed: !todo.completed });
    } catch (error) {
      return rejectWithValue('Failed to toggle todo');
    }
  }
);

interface TodoState {
  entities: { [id: string]: Todo };
  ids: string[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: TodoState = {
  entities: {},
  ids: [],
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
        state.entities = {};
        state.ids = [];
        action.payload.forEach(todo => {
          state.entities[todo._id] = todo;
          state.ids.push(todo._id);
        });
      })
      .addCase(getTodos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string || 'Failed to fetch todos';
      })
      .addCase(addTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        state.entities[action.payload._id] = action.payload;
        state.ids.push(action.payload._id);
      })
      .addCase(updateTodos.fulfilled, (state, action: PayloadAction<Todo>) => {
        if (state.entities[action.payload._id]) {
          state.entities[action.payload._id] = action.payload;
        }
      })
      .addCase(removeTodo.fulfilled, (state, action: PayloadAction<string>) => {
        delete state.entities[action.payload];
        state.ids = state.ids.filter(id => id !== action.payload);
      })
      .addCase(toggleTodo.fulfilled, (state, action: PayloadAction<Todo>) => {
        if (state.entities[action.payload._id]) {
          state.entities[action.payload._id] = action.payload;
        }
      });
  },
});

export default todoSlice.reducer;