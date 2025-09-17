import { z } from "zod";

export const containerSchema = z.object({
  shippingLineId: z.string().uuid("Invalid Shipping Line ID"),

  size: z.enum(["LCL", "20FT", "40FT"], {
    message: "Invalid container size",
  }),

  vanNumber: z
    .string()
    .min(1, "Van number is required")
    .max(100, "Van number cannot exceed 100 characters"),

  isReturned: z.boolean().optional(),
});
