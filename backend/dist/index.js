"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = __importDefault(require("./database/config"));
const task_1 = __importDefault(require("./routes/task"));
const user_1 = __importDefault(require("./routes/user"));
const app = (0, express_1.default)();
// Configure CORS options
const corsOptions = {
    origin: ['http://localhost:3000', 'https://your-frontend-url.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
};
// Use CORS middleware with options
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
(0, config_1.default)();
app.use('/api', task_1.default);
app.use('/api', user_1.default);
app.get("/", (req, res) => {
    res.send("hello");
});
app.listen(3000, () => {
    console.log("Server Connected on Port 3000");
});
