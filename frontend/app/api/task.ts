import { Todo } from '@/store/todoSlice';
import axios from 'axios';

const API_URL = 'https://task-management-dashboard-jainam.vercel.app/api/tasks';

// Fetch all todos
export const fetchTodos = async (): Promise<Todo[]> => {
  try {
    const response = await axios.get(API_URL);
    console.log('API response:', response.data);
    // Ensure we're returning the array of todos
    return Array.isArray(response.data.task) ? response.data.task : [];
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw new Error('Failed to fetch todos');
  }
};

// Create a new todo
export const createTodo = async (todo: Omit<Todo, 'id' | '_id'>): Promise<Todo> => {
  try {
    const response = await axios.post(API_URL, todo, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Created todo:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw new Error('Failed to create todo');
  }
};

// Update a todo
export const updateTodo = async (todo: Todo): Promise<Todo> => {
  try {
    const response = await axios.put(`${API_URL}/${todo._id}`, todo, {
      headers: { 'Content-Type': 'application/json' }
    });
    console.log('Updated todo:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating todo:', error);
    throw new Error('Failed to update todo');
  }
};

// Delete a todo
export const deleteTodo = async (id: string): Promise<void> => {
  try {
    console.log("Deleting todo with id:", id);
    await axios.delete(`${API_URL}/${id}`);
    console.log('Todo deleted successfully');
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw new Error('Failed to delete todo');
  }
};