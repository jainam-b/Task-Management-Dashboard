import React, { useState, useEffect } from 'react';
import { 
  AlertDialog, 
  AlertDialogContent, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogAction, 
  AlertDialogCancel 
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input'; 
import { Textarea } from '@/components/ui/textarea'; 
import { Button } from '@/components/ui/button'; 
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TodoStatus, TodoPriority, Todo } from '../store/todoSlice';

interface TodoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (todo: Omit<Todo, 'id'>) => void;
  todoToEdit?: Todo;
}

const TodoDialog: React.FC<TodoDialogProps> = ({ isOpen, onClose, onSave, todoToEdit }) => {
  const [title, setTitle] = useState('');
  
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.ToDo);
  const [priority, setPriority] = useState<TodoPriority>(TodoPriority.Low);
  const [dueDate, setDueDate] = useState('');

  useEffect(() => {
    if (todoToEdit) {
      setTitle(todoToEdit.title);
      setDescription(todoToEdit.description || '');
      setStatus(todoToEdit.status);
      setPriority(todoToEdit.priority);
      setDueDate(todoToEdit.dueDate || '');
    } else {
      resetForm();
    }
  }, [todoToEdit]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setStatus(TodoStatus.ToDo);
    setPriority(TodoPriority.Low);
    setDueDate('');
  };

  const handleSave = () => {
    if (title.trim()) {
      onSave({
        title, 
        description, 
        status, 
        priority, 
        dueDate, 
        completed: todoToEdit?.completed || false 
      });
      onClose();
      resetForm();
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="bg-white text-black shadow-lg max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl font-bold">
            {todoToEdit ? 'Edit Todo' : 'Add Todo'}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {todoToEdit ? 'Update the details for this todo item.' : 'Please fill in the details for the new todo item.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="Enter todo title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Enter todo description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value as TodoStatus)}>
              <SelectTrigger id="status">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TodoStatus).map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(value) => setPriority(value as TodoPriority)}>
              <SelectTrigger id="priority">
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(TodoPriority).map((p) => (
                  <SelectItem key={p} value={p}>
                    {p}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel asChild>
            <Button variant="outline" onClick={onClose}>Cancel</Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button onClick={handleSave}>{todoToEdit ? 'Update' : 'Save'}</Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default TodoDialog;