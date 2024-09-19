"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const task_1 = __importDefault(require("../database/task"));
const router = express_1.default.Router();
// route to get all task
router.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const tasks = yield task_1.default.find();
    if (tasks) {
        res.status(201).json({
            task: tasks,
        });
    }
}));
// route to create new task
router.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const newTask = yield task_1.default.create({
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
}));
// route to edit task 
router.put("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const updatedTask = yield task_1.default.findByIdAndUpdate(taskId, {
            title,
            description: description || "",
            status: status || "To Do",
            priority: priority || "Medium",
            dueDate: dueDate || null,
        }, { new: true });
        if (!updatedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
// route to delete task
router.delete("/tasks/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const taskId = req.params.id;
    try {
        const deletedTask = yield task_1.default.findByIdAndDelete(taskId);
        if (!deletedTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        res.status(200).json({
            message: "Task deleted successfully",
            task: deletedTask,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Server error" });
    }
}));
exports.default = router;
