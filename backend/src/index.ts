import express from "express";
import cors from "cors";
import connectDB from "./database/config";
import taskRouter from "./routes/task";
const app=express();
app.use(cors());
app.use(express.json());

connectDB();
app.use('/api', taskRouter);
app.get("/",(req,res)=>{
    res.send("hello")
})

app.listen(3000,()=>{
    console.log("Server Connect on Port-No 3000");
    
})


