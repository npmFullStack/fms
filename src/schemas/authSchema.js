import { z } from "zod";

export const registerSchema = z
    .object({
        firstName: z.string().min(1, "First Name is required"),
        lastName: z.string().min(1, "Last Name is required"),
        email: z.string().email("Invalid Email"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(1, "Please confirm your password")
    })
    .refine(data => data.password === data.confirmPassword, {
        message: "Passwords don't match",
        path: ["confirmPassword"]
    });

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(8, "Password must be at least 8 characters")
});
