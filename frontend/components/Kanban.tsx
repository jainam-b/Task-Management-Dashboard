"use client"
import React, { useEffect, useState } from 'react';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { fetchTodos, updateTodoStatus } from '@/app/api/task';

interface Todo {
  _id: any;
  id: string;
  title: string;
  description?: string;
  status: string;
  priority: string;
  dueDate?: string;
  completed: boolean;
}

// Column component
const Column = ({ status, children }: any) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: any) => {
      item.moveTask(item.id, status);
    },
  });

  return (
    <div
      ref={drop}
      className="bg-gray-200 rounded-lg shadow-md p-4 w-80"
    >
      <h2 className="text-xl font-bold mb-4">{status}</h2>
      {children}
    </div>
  );
};

// Task component
const Task = ({ todo, moveTask, onOpenDialog }: { todo: Todo; moveTask: any; onOpenDialog: (todo: Todo) => void }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: todo._id, moveTask }, // Updated to match the ID field in your data
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  return (
    <div
      ref={drag}
      className="bg-white p-4 rounded-lg shadow-md mb-2 cursor-pointer"
      style={{ opacity: isDragging ? 0.5 : 1 }}
      onClick={() => onOpenDialog(todo)}
    >
      {todo.title}
    </div>
  );
};

// Main Kanban board component
const Kanban = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedTask, setSelectedTask] = useState<Todo | null>(null);

  // Fetch todos on mount
  useEffect(() => {
    const loadTodos = async () => {
      try {
        const data = await fetchTodos();
        setTodos(data);
      } catch (error) {
        console.error('Failed to fetch todos:', error);
      }
    };
    loadTodos();
  }, []);

  // Move task between statuses
  const moveTask = async (id: string, newStatus: string) => {
    // Update local state
    const updatedTodos = todos.map((todo) =>
      todo._id === id ? { ...todo, status: newStatus } : todo
    );
    setTodos(updatedTodos);

    // Update the status in the backend
    try {
      await updateTodoStatus(id, newStatus);
    } catch (error) {
      console.error('Failed to update todo status:', error);
      // Optionally, revert local state if the backend update fails
      setTodos(todos); // Revert to the original state
    }
  };

  const handleOpenDialog = (todo: Todo) => {
    setSelectedTask(todo);
  };

  const handleCloseDialog = () => {
    setSelectedTask(null);
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 p-4 overflow-x-auto">
        {['To Do', 'In Progress', 'Done'].map((status) => (
          <Column status={status} key={status}>
            {todos
              .filter((todo) => todo.status === status)
              .map((todo) => (
                <Task key={todo._id} todo={todo} moveTask={moveTask} onOpenDialog={handleOpenDialog} />
              ))}
          </Column>
        ))}
      </div>

      {selectedTask && (
        <AlertDialog open={!!selectedTask} onOpenChange={handleCloseDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{selectedTask.title}</AlertDialogTitle>
              <AlertDialogDescription>
                <p>Status: {selectedTask.status}</p>
                <p>Description: {selectedTask.description || 'No description'}</p>
                {/* Add more details or actions if needed */}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleCloseDialog}>Close</AlertDialogCancel>
              {/* Add more actions if needed */}
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DndProvider>
  );
};

export default Kanban;
