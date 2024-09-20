"use client";
import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag, useDrop, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { getTodos, updateTodos, toggleTodo, Todo, TodoStatus, TodoPriority } from '../store/todoSlice';
import { AppDispatch, RootState } from '../store/store';

// Column component
const Column: React.FC<{ status: TodoStatus; onDrop: (item: any, status: TodoStatus) => void }> = ({ status, onDrop, children }) => {
  const [, drop] = useDrop({
    accept: 'CARD',
    drop: (item: any) => onDrop(item, status),
  });

  return (
    <div
      ref={drop}
      className="bg-gray-100 rounded-lg p-4 w-80 min-h-[300px] border border-gray-200 transition duration-200 ease-in-out"
    >
      <h2 className="text-xl font-semibold mb-4 text-gray-800">{status}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
};

// Task component
const Task: React.FC<{ 
  todo: Todo; 
  onOpenDialog: (todo: Todo) => void;
  onToggle: (todo: Todo) => void;
}> = ({ todo, onOpenDialog, onToggle }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: { id: todo._id, originalStatus: todo.status },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const getPriorityColor = (priority: TodoPriority) => {
    switch (priority) {
      case TodoPriority.High:
        return 'bg-red-500';
      case TodoPriority.Medium:
        return 'bg-yellow-500';
      case TodoPriority.Low:
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      ref={drag}
      className={`bg-white p-4 rounded-lg shadow-sm border-l-4 ${getPriorityColor(todo.priority)} hover:shadow-md transition duration-200 ease-in-out ${
        isDragging ? 'opacity-50' : 'opacity-100'
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 
          className="text-md font-medium text-gray-900 cursor-pointer"
          onClick={() => onOpenDialog(todo)}
        >
          {todo.title}
        </h3>
        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo)}
          className="form-checkbox h-5 w-5 text-blue-600"
        />
      </div>
      {todo.description && <p className="text-sm text-gray-500 mt-1">{todo.description}</p>}
      {todo.dueDate && (
        <p className="text-xs text-gray-400 mt-2">
          Due: {new Date(todo.dueDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
};

// Main Kanban board component
const Kanban: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const todos = useSelector((state: RootState) => Object.values(state.todos.entities));
  const [selectedTask, setSelectedTask] = React.useState<Todo | null>(null);

  useEffect(() => {
    dispatch(getTodos());
  }, [dispatch]);

  const handleDrop = useCallback((item: { id: string, originalStatus: TodoStatus }, newStatus: TodoStatus) => {
    const todoToMove = todos.find((todo) => todo._id === item.id);
    if (!todoToMove || todoToMove.status === newStatus) return;
  
    // Optimistic update
    const optimisticUpdatedTodo = { ...todoToMove, status: newStatus };
    dispatch({ type: 'todos/updateLocal', payload: optimisticUpdatedTodo });
  
    // Proceed with actual async update
    dispatch(updateTodos(optimisticUpdatedTodo));
  }, [dispatch, todos]);
  

  const handleToggle = useCallback((todo: Todo) => {
    dispatch(toggleTodo(todo));
  }, [dispatch]);

  const handleOpenDialog = useCallback((todo: Todo) => {
    setSelectedTask(todo);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedTask(null);
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="flex space-x-4 p-4 overflow-x-auto bg-gray-50 min-h-screen">
        {Object.values(TodoStatus).map((status) => (
          <Column status={status} key={status} onDrop={handleDrop}>
            {todos
              .filter((todo) => todo.status === status)
              .map((todo) => (
                <Task 
                  key={todo._id} 
                  todo={todo} 
                  onOpenDialog={handleOpenDialog}
                  onToggle={handleToggle}
                />
              ))}
          </Column>
        ))}
      </div>

      {selectedTask && (
        <AlertDialog open={!!selectedTask} onOpenChange={handleCloseDialog}>
          <AlertDialogContent className="bg-white shadow-lg rounded-lg p-6">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-lg font-bold text-gray-900">{selectedTask.title}</AlertDialogTitle>
              <AlertDialogDescription className="text-sm text-gray-600 mt-2">
                <p><strong>Status:</strong> {selectedTask.status}</p>
                <p><strong>Priority:</strong> {selectedTask.priority}</p>
                <p className="mt-1"><strong>Description:</strong> {selectedTask.description || 'No description'}</p>
                {selectedTask.dueDate && (
                  <p className="mt-1"><strong>Due Date:</strong> {new Date(selectedTask.dueDate).toLocaleDateString()}</p>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel asChild>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Close
                </Button>
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </DndProvider>
  );
};

export default Kanban;