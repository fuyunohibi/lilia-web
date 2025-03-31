import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  full_name: z.string().min(1, "Full name is required"),
  terms: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the terms" }),
  }),
});