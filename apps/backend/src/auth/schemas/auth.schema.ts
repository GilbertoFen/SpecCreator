import { z } from '../../shared/pipes/zod-validation.pipe';

const usernameSchema = z
  .string()
  .trim()
  .min(3, 'username debe tener al menos 3 caracteres.')
  .max(32, 'username no puede superar 32 caracteres.')
  .regex(
    /^[a-zA-Z0-9_.-]+$/,
    'username solo puede contener letras, numeros, punto, guion y guion bajo.',
  );

const passwordSchema = z
  .string()
  .min(8, 'password debe tener al menos 8 caracteres.')
  .max(72, 'password no puede superar 72 caracteres.');

export const registerSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export const loginSchema = z.object({
  username: usernameSchema,
  password: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
