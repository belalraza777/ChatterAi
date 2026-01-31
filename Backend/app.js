dotenv.config();
import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;
import express from 'express';
const app = express();
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from "cors";

// Security packages
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

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


// Rate Limiting
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
const authLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    message: 'Too many login/signup attempts from this IP, please try again later.'
});
app.use('/api', limiter);
app.use('/api/user/login', authLimiter);
app.use('/api/user/signup', authLimiter);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

if (NODE_ENV === 'production') {
    app.use(express.static('public'));
    app.use(helmet());
    app.use(morgan('tiny'));
} else {
    app.use(morgan('dev'));
}

// CORS
app.use(cors({
    origin: NODE_ENV === 'production'
        ? process.env.FRONTEND_URL
        : 'http://localhost:5173',
    credentials: true
}));


// routes
app.use("/api/chat", chatRouter);
app.use("/api/user", userRouter);


//error handling middleware
app.use((err, req, res, next) => {
    const { status = 500, message = "some error" } = err;
    res.status(status).send(err.message);
});


app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on Port: ${PORT}`);
});