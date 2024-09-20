"use client"
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTodos, addTodo, removeTodo, updateTodos, toggleTodo, Todo as TodoType } from '../store/todoSlice';
import { RootState, AppDispatch } from '@/store/store';
import { X, Edit, Plus, Loader2, Calendar, Flag } from 'lucide-react';
import { Button } from '@/components/ui/button'; 
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from '@/components/ui/checkbox';
import TodoDialog from '@/components/TodoModal';

const Spinner: React.FC = () => (
  <div className="flex justify-center items-center h-40">
    <Loader2 className="h-8 w-8 animate-spin text-red-500" />
  </div>
);

const EmptyState: React.FC = () => (
  <div className="text-center py-10">
    <h3 className="mt-2 text-sm font-semibold text-gray-900">No tasks</h3>
    <p className="mt-1 text-sm text-gray-500">Get started by creating a new task</p>
  </div>
);

const PriorityFlag: React.FC<{ priority: number }> = ({ priority }) => {
  // Ensure priority is within the range of available colors
  const colors = ['text-gray-400', 'text-blue-500', 'text-orange-500', 'text-red-500'];
  
  // Use a fallback if priority exceeds the defined range (e.g., default to 0)
  const colorClass = colors[priority] || colors[0];

  return <Flag className={`h-4 w-4 ${colorClass}`} />;
};


const Todo: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => Object.values(state.todos.entities));
  const status = useSelector((state: RootState) => state.todos.status);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [todoToEdit, setTodoToEdit] = useState<TodoType | null>(null);
  
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', day: 'numeric', month: 'long'
  });

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const handleAddTodo = async (todo: Omit<TodoType, 'id' | '_id'>) => {
    try {
      await dispatch(addTodo(todo)).unwrap();
      setDialogOpen(false);
      location.reload();
    } catch (error) {
      console.error("Failed to add todo:", error);
    }
  };

  const handleEditTodo = (todo: TodoType) => {
    setTodoToEdit(todo);
    setDialogOpen(true);
  };

  const handleRemoveTodo = async (id: string) => {
    try {
      await dispatch(removeTodo(id)).unwrap();
    } catch (error) {
      console.error('Failed to delete todo:', error);
    }
  };

  const handleToggleTodo = async (todo: TodoType) => {
    if (todo.completed) {
      try {
        await dispatch(removeTodo(todo._id)).unwrap();
      } catch (error) {
        console.error('Failed to delete todo:', error);
      }
    } else {
      dispatch(toggleTodo(todo)); // Toggle the completion state if not completed yet
    }
  };

  const handleSave = (todo: Omit<TodoType, 'id' | '_id'>) => {
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
      return <Spinner />;
    }

    if (todos.length === 0) {
      return <EmptyState />;
    }

    return (
      <ul className="space-y-1">
        {todos.map((todo) => (
          <li key={todo._id} className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-lg transition">
            <div className="flex items-center space-x-3 flex-grow">
              <Checkbox
                checked={todo.completed}
                onCheckedChange={() => handleToggleTodo(todo)}
                id={`todo-${todo._id}`}
                className="rounded-full"
              />
              <div className="flex flex-col">
                <label
                  htmlFor={`todo-${todo._id}`}
                  className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}
                >
                  {todo.title}
                </label>
                {todo.description && (
                  <span className="text-xs text-gray-500">{todo.description}</span>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {todo.dueDate && (
                <span className="text-xs text-gray-500 flex items-center">
                  <Calendar className="h-3 w-3 mr-1" />
                  {new Date(todo.dueDate).toLocaleDateString()}
                </span>
              )}
              {/* <PriorityFlag priority={todo.priority} /> */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleRemoveTodo(todo._id)}
                className="text-gray-400 hover:text-red-500 transition"
                aria-label="Delete Todo"
              >
                <X size={16} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEditTodo(todo)}
                className="text-gray-400 hover:text-blue-500 transition"
                aria-label="Edit Todo"
              >
                <Edit size={16} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gray-50 min-h-screen">
      <Card className="w-full max-w-3xl mx-auto shadow-lg">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Today</h2>
              <p className="text-sm text-gray-500">{today}</p>
            </div>
            <Button onClick={() => setDialogOpen(true)} className="bg-red-500 text-white hover:bg-red-600 transition flex items-center space-x-2">
              <Plus size={16} />
              <span>Add Task</span>
            </Button>
          </div>
          {renderTodoList()}
        </CardContent>
      </Card>
      <TodoDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setTodoToEdit(null);
        }}
        onSave={handleSave}
        todoToEdit={todoToEdit}
      />
    </div>
  );
};

export default Todo;
