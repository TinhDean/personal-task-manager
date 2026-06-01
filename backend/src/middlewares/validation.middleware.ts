import { Request, Response, NextFunction } from 'express';
import { ZodSchema, ZodError, ZodIssue } from 'zod';

export const validateSchema = (schema: ZodSchema) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // parseAsync validates and returns stripped/formatted data
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        const errorDetails = zodError.issues.map((err: ZodIssue) => ({
          field: err.path.join('.'),
          message: err.message,
        }));
        
        const detailsString = zodError.issues.map((err: ZodIssue) => err.message).join(', ');

        res.status(400).json({
          message: 'Dữ liệu không hợp lệ',
          errors: errorDetails,
          details: detailsString,
        });
        return;
      }
      res.status(500).json({ message: 'Lỗi hệ thống khi kiểm tra dữ liệu' });
      return;
    }
  };
};
