import { z } from "zod";

export const RegisterSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username is too short'),
  age: z.coerce.number().min(10, 'Age must be at least 10'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});