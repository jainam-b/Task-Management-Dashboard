"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const taskSchema = new mongoose_1.default.Schema({
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
}, {
    timestamps: true,
});
const Task = mongoose_1.default.model("Task", taskSchema);
exports.default = Task;
