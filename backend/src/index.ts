import express from "express";
import cors from "cors";
import connectDB from "./database/config";
import taskRouter from "./routes/task";
import UserRouter from "./routes/user";

const app = express();

// Configure CORS options
const corsOptions = {
  origin: ['http://localhost:3000', 'https://your-frontend-url.com'], 
  methods: ['GET', 'POST', 'PUT', 'DELETE'], 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  credentials: true 
};

// Use CORS middleware with options
app.use(cors(corsOptions));

app.use(express.json());

connectDB();

app.use('/api', taskRouter);
app.use('/api', UserRouter);

app.get("/", (req, res) => {
    res.send("hello");
});

app.listen(3000, () => {
    console.log("Server Connected on Port 3000");
});
