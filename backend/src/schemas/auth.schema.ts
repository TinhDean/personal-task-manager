import { z } from 'zod';

export const registerSchema = z.object({
  username: z
    .string({ message: 'Tài khoản là bắt buộc' })
    .min(3, { message: 'Tài khoản phải có tối thiểu 3 ký tự' })
    .trim(),
  password: z
    .string({ message: 'Mật khẩu là bắt buộc' })
    .min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }),
  email: z
    .string()
    .email({ message: 'Email không đúng định dạng' })
    .optional()
    .or(z.literal('')), // Cho phép chuỗi rỗng
});

export const loginSchema = z.object({
  username: z
    .string({ message: 'Tài khoản là bắt buộc' })
    .min(3, { message: 'Tài khoản phải có tối thiểu 3 ký tự' })
    .trim(),
  password: z
    .string({ message: 'Mật khẩu là bắt buộc' })
    .min(6, { message: 'Mật khẩu phải có tối thiểu 6 ký tự' }),
});
