import dotenv from 'dotenv';
// Load environment variables from .env file
dotenv.config();

import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route';
import taskRoutes from './routes/task.route';

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Middlewares
app.use(cors());
app.use(express.json());

// Welcome Route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to the Personal Task Manager API (MongoDB version)!',
    status: 'success',
    timestamp: new Date().toISOString(),
  });
});

// Api Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

if (!MONGODB_URI) {
  console.error('ERROR: MONGODB_URI is not defined in the .env file.');
  process.exit(1);
}

// Connect to MongoDB and start server
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected successfully to MongoDB!');
    app.listen(PORT, () => {
      console.log(`Server is running at http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  });
