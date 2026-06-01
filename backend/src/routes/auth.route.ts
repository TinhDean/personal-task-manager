import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { validateSchema } from '../middlewares/validation.middleware';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

// /api/auth/register
router.post('/register', validateSchema(registerSchema) as any, register);

// /api/auth/login
router.post('/login', validateSchema(loginSchema) as any, login);

export default router;
