// todo component
"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, addTodo, removeTodo, updateTodos, toggleTodo } from '../store/todoSlice';
import { RootState } from '@/store/store';
import { X, Edit, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { CardHeader } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';

import TodoDialog from '@/components/TodoModal';
import { createTodo, deleteTodo } from '@/app/api/task';

const Todo: React.FC = () => {
  const dispatch = useDispatch();
  const todos = useSelector((state: RootState) => state.todos.todos);
  const status = useSelector((state: RootState) => state.todos.status);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<Todo | null>(null);
  console.log("______",todos);
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
  });

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const handleAddTodo = async (todo: Omit<Todo, 'id'>) => {
    try {
      // Create the todo via API
      await createTodo(todo);
      
      // Refetch todos or update local state
      const updatedTodos = await fetchTodos(); // Fetch updated todos
      dispatch(setTodos(updatedTodos)); // Update the Redux state with new todos
      
      setDialogOpen(false); // Close the modal after adding the task
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };
  

  const handleEditTodo = (todo: Todo) => {
    setTodoToEdit(todo);
    setDialogOpen(true);
  };

  const handleRemoveTodo = async (id: string) => {
    try {
      // Await the deleteTodo API call to ensure the todo is removed on the server
      await deleteTodo(id);
      dispatch(removeTodo(id));
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleTodo = (id: string) => {
    dispatch(toggleTodo(id));
  };

  const handleSave = (todo: Omit<Todo, 'id'>) => {
    if (todoToEdit) {
      dispatch(updateTodos({ ...todoToEdit, ...todo }));
      setTodoToEdit(null);
    } else {
      handleAddTodo(todo);
    }
    setDialogOpen(false);
  };

  const renderTodoList = () => {
    if (status === 'loading') {
      return <div>Loading...</div>;
    }

    if (!Array.isArray(todos) || todos.length === 0) {
      return <div>No todos yet. Add a new one to get started!</div>;
    }

    return (
      <ul className="space-y-4">
        {todos.map((todo) => (
          <li key={todo._id} className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition">
            <div className="flex items-center space-x-4">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo._id)}
                id={`todo-${todo.id}`}
              />
              <label
                htmlFor={`todo-${todo.id}`}
                className={`text-lg ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
              >
                {todo.title}
              </label>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTodo(todo._id)}
                className="text-red-500 hover:text-red-700 transition"
                aria-label="Delete Todo"
              >
                <X size={18} />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleEditTodo(todo)}
                className="text-blue-500 hover:text-blue-700 transition"
                aria-label="Edit Todo"
              >
                <Edit size={18} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <>
      <div className="w-full max-w-lg mx-auto mt-10 rounded-lg">
        <CardHeader>
          <div className="text-center text-gray-600 mt-2">
            <h2 className="text-xl font-semibold">Today</h2>
            <p className="text-lg">{today}</p>
          </div>
        </CardHeader>
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <Button onClick={() => setDialogOpen(true)} className="bg-blue-500 text-white hover:bg-blue-600 transition flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Task</span>
            </Button>
          </div>
          {renderTodoList()}
        </div>
      </div>
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTodoToEdit(null);
        }}
        onSave={handleSave}
        todoToEdit={todoToEdit}
      />
    </>
  );
};

export default Todo;