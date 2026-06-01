import { z } from 'zod';

export const createTaskSchema = z.object({
  title: z
    .string({ message: 'Tiêu đề công việc là bắt buộc' })
    .min(1, { message: 'Tiêu đề không được để trống' })
    .trim(),
});

export const updateTaskSchema = z.object({
  title: z
    .string()
    .min(1, { message: 'Tiêu đề không được để trống' })
    .trim()
    .optional(),
  completed: z
    .boolean({ message: 'Trạng thái hoàn thành phải là kiểu boolean' })
    .optional(),
});
