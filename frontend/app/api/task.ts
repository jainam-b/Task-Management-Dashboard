// api/task.ts
import { Todo } from '@/store/todoSlice';
import axios from 'axios';

const API_URL = 'https://task-management-dashboard-jainam.vercel.app/api/tasks';

// Fetch all todos
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data.task);
    return response.data.task;
  } catch (error) {
    throw new Error('Failed to fetch todos');
  }
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  try {
    const response = await axios.post(API_URL, todo, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to create todo');
  }
};

export const updateTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const response = await axios.put(`${API_URL}/${todo._id}`, todo, {
      headers: { 'Content-Type': 'application/json' }
    });
    return response.data;
  } catch (error) {
    throw new Error('Failed to update todo');
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    // Log the id to ensure it's correct
    console.log("Deleting todo with id:", id);

    // Send the delete request to the API
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    throw new Error('Failed to delete todo');
  }
};