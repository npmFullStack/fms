import { z } from "zod";

// For the role dropdown options (frontend only)
const roleOptions = [
    { value: "customer", label: "Customer" },
    { value: "marketing_coordinator", label: "Marketing Coordinator" },
    { value: "admin_finance", label: "Admin Finance" },
    { value: "general_manager", label: "General Manager" }
];

export const addUserSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    role: z.object({
        value: z.enum([
            "customer",
            "marketing_coordinator",
            "admin_finance",
            "general_manager"
        ]),
        label: z.string()
    }),
    password: z.string().min(8, "Password must be at least 8 characters"),
    phone: z.string().optional().nullable(),
    profile_picture: z.string().optional().nullable()
});

export const updateUserSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    email: z.string().email("Invalid email address"),
    role: z.object({
        value: z.enum([
            "customer",
            "marketing_coordinator",
            "admin_finance",
            "general_manager"
        ]),
        label: z.string()
    }),
    phone: z.string().optional().nullable()
});