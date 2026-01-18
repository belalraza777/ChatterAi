import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";

// import path from "path";
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

import chatRouter from './routes/chat.js';
import userRouter from './routes/user.js';


//connect db
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected with Database!");
    } catch (err) {
        console.log("Failed to connect with Db", err);
    }
}
connectDB();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

//cors 
app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",  // React dev server URL & port
  credentials: true,                 // Allow cookies to be sent
}));


// routes
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);


//error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "some error" } = err;
    res.status(status).send(err.message);
});

app.listen(3000, () => {
    console.log(`Server running on Port:- 3000 `);
});