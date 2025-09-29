// frontend/schemas/shipSchema.js
import { z } from "zod";

export const shipSchema = z.object({
  shippingLineId: z.string().uuid({ message: "Invalid Shipping Line ID" }).optional(), // Make optional
  shipName: z
    .string()
    .min(1, { message: "Ship name is required" })
    .max(100, { message: "Ship name cannot exceed 100 characters" }),
  vesselNumber: z
    .string()
    .min(1, { message: "Vessel number is required" })
    .max(50, { message: "Vessel number cannot exceed 50 characters" })
});
