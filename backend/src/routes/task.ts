import express from "express";
import Task from "../database/task";
const router = express.Router();

// route to get all task
router.get("/tasks", async (req, res) => {
  const tasks = await Task.find();
  if (tasks) {
    res.status(201).json({
      task: tasks,
    });
  }
});
// route to create new task
router.post("/tasks", async (req, res) => {
  const { title, description, status, priority, dueDate } = req.body;

  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }

  const validStatuses = ["To Do", "In Progress", "Completed"];
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status value" });
  }

  const validPriorities = ["Low", "Medium", "High"];
  if (priority && !validPriorities.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority value" });
  }

  const newTask = await Task.create({
    title,
    description: description || "",
    status: status || "To Do",
    priority: priority || "Medium",
    dueDate: dueDate || null,
  });

  res.status(201).json({
    message: "Task created successfully",
    task: newTask,
  });
});


// route to edit task 
router.put("/tasks/:id", async (req, res) => {
    const { title, description, status, priority, dueDate } = req.body;
    const taskId = req.params.id;  
  
    // Validate inputs
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }
  
    const validStatuses = ["To Do", "In Progress", "Completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }
  
    const validPriorities = ["Low", "Medium", "High"];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({ error: "Invalid priority value" });
    }
  
    try {
      
      const updatedTask = await Task.findByIdAndUpdate(
        taskId,
        {
          title,
          description: description || "",
          status: status || "To Do",
          priority: priority || "Medium",
          dueDate: dueDate || null,
        },
        { new: true } 
      );
  
      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({
        message: "Task updated successfully",
        task: updatedTask,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });


// route to delete task
router.delete("/tasks/:id", async (req, res) => {
    const taskId = req.params.id;
  
    try {
      const deletedTask = await Task.findByIdAndDelete(taskId);
  
      if (!deletedTask) {
        return res.status(404).json({ error: "Task not found" });
      }
  
      res.status(200).json({
        message: "Task deleted successfully",
        task: deletedTask,
      });
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  });
   
export default router;
