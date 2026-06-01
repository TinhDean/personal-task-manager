import { Router } from 'express';
import { getTasks, createTask, updateTask, deleteTask } from '../controllers/task.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validateSchema } from '../middlewares/validation.middleware';
import { createTaskSchema, updateTaskSchema } from '../schemas/task.schema';

const router = Router();

// Protect all routes in this router
router.use(authMiddleware as any);

// GET /api/tasks - Retrieve all tasks for the logged in user (supports ?search=query)
router.get('/', getTasks as any);

// POST /api/tasks - Create a new task
router.post('/', validateSchema(createTaskSchema) as any, createTask as any);

// PUT /api/tasks/:id - Update status/title of a task
router.put('/:id', validateSchema(updateTaskSchema) as any, updateTask as any);

// DELETE /api/tasks/:id - Delete a task
router.delete('/:id', deleteTask as any);

export default router;
