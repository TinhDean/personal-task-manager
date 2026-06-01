import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const JWT_SECRET = process.env.JWT_SECRET || 'my-super-secret-key-12345';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
  };
}

export const authMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'No token provided, authorization denied' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as { id: string; username: string };
    req.user = {
      id: decoded.id,
      username: decoded.username,
    };
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
    return;
  }
};
