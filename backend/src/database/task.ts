import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true, 
    },
    description: {
      type: String,
      default: "", 
    },
    status: {
      type: String,
      enum: ["To Do", "In Progress", "Completed"],
      default: "To Do",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    dueDate: {
      type: Date, 
    },
  },
  {
    timestamps: true, 
  }
);
const Task = mongoose.model("Task", taskSchema);
export default Task;
