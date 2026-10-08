import { z } from "zod";

// Client-side checks for fast feedback only. The backend must enforce its own
// rules; anything here can be bypassed by calling the API directly.

// Normalize first, then validate, so " Alex@Example.com " is accepted.
const email = z.string().trim().toLowerCase().pipe(z.email("Enter a valid email address"));

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password"),
  remember: z.boolean(),
});

export type LoginValues = z.infer<typeof loginSchema>;

export const PASSWORD_MIN_LENGTH = 8;

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(24, "Username must be 24 characters or fewer")
      .regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers and underscores only"),
    email,
    password: z
      .string()
      .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters`)
      .max(128, "Use 128 characters or fewer"),
    confirmPassword: z.string().min(1, "Confirm your password"),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type SignupValues = z.infer<typeof signupSchema>;
