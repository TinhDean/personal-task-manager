import { Response } from 'express';
import { Task } from '../models/Task';
import { AuthenticatedRequest } from '../middlewares/auth.middleware';

export const getTasks = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Build query filter
    const queryFilter: any = { userId };
    const { search } = req.query;

    if (search && typeof search === 'string') {
      queryFilter.title = { $regex: search, $options: 'i' }; // case-insensitive regex search
    }

    const userTasks = await Task.find(queryFilter).sort({ createdAt: -1 });
    res.json(userTasks);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to retrieve tasks' });
  }
};

export const createTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title } = req.body;

    const newTask = new Task({
      title,
      userId,
      completed: false,
    });

    await newTask.save();

    res.status(201).json(newTask);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to create task' });
  }
};

export const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const { title, completed } = req.body;
    const updateData: any = {};

    if (title !== undefined) {
      updateData.title = title;
    }

    if (completed !== undefined) {
      updateData.completed = completed;
    }

    // Find task and update (ensure the user owns it)
    const task = await Task.findOneAndUpdate(
      { _id: id, userId },
      updateData,
      { new: true } // returns the updated document
    );

    if (!task) {
      res.status(404).json({ message: 'Task not found or access denied' });
      return;
    }

    res.json(task);
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to update task' });
  }
};

export const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Find task and delete (ensure the user owns it)
    const task = await Task.findOneAndDelete({ _id: id, userId });

    if (!task) {
      res.status(404).json({ message: 'Task not found or access denied' });
      return;
    }

    res.json({ message: 'Task deleted successfully', id });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Failed to delete task' });
  }
};
