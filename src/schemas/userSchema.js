// src/components/modals/schemas/userSchema.js
import { z } from "zod";

export const addUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  role: z.enum([
    "customer",
    "marketing_coordinator", 
    "admin_finance",
    "general_manager"
  ]),
  phone: z.string().optional().nullable(),
  profile_picture: z.string().optional().nullable()
});

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First Name is required"),
  lastName: z.string().min(1, "Last Name is required"),
  email: z.string().email("Invalid email address"),
  role: z.enum([ 
    "customer",
    "marketing_coordinator",
    "admin_finance", 
    "general_manager"
  ]),
  phone: z.string().optional().nullable()
});