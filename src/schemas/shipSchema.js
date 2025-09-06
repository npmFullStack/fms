import { z } from "zod";

export const shipSchema = z.object({
  shippingLineId: z.string().uuid("Invalid Shipping Line ID"),

  vesselNumber: z
    .string()
    .min(1, "Vessel number is required")
    .max(50, "Vessel number cannot exceed 50 characters"),

  containers: z
    .array(
      z.object({
        size: z.enum(["LCL", "20FT", "40FT"], {
          message: "Invalid container size",
        }),
        vanNumber: z
          .string()
          .min(1, "Van number is required")
          .max(100, "Van number cannot exceed 100 characters"),
      })
    )
    .min(1, { message: "At least one container is required" }),
});
