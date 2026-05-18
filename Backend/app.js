import dotenv from 'dotenv';
dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 5000;

import express from 'express';
import mongoose from 'mongoose';
import chatRouter from './routes/chat.js';
import userRouter from './routes/user.js';
import { applyGlobalMiddleware, applyErrorMiddleware } from './middleware/setupMiddleware.js';

const app = express();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log('Connected with Database!');
  } catch (err) {
    console.log('Failed to connect with Db', err);
  }
};
connectDB();

applyGlobalMiddleware(app);

app.use('/api/chat', chatRouter);
app.use('/api/user', userRouter);

applyErrorMiddleware(app);

app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on Port: ${PORT}`);
});
