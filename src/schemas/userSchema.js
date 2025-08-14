import { z } from "zod";

export const userSchema = z.object({
    firstName: z.string().min(1, "First Name is required"),
    lastName: z.string().min(1, "Last Name is required"),
    role: z.object({
        value: z.string(),
        label: z.string()
    })
});
