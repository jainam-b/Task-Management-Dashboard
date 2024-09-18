import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const MONGO_URI=process.env.DATABASE_URL;

const connectDB =async()=>{
    if (!MONGO_URI) {
        console.error("MongoDB URI is not defined in environment variables");
        process.exit(1);  
      }
    
      try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB connected successfully");
      } catch (err) {
        console.error("Error connecting to MongoDB", err);
        process.exit(1);  
      }
    };
    
export default connectDB;