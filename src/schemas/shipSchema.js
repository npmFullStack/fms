import { z } from "zod";

export const shipSchema = z.object({
  shippingLineId: z.string().uuid("Invalid Shipping Line ID"),
  name: z.string().min(1, "Ship name is required"),
  vesselNumber: z.string().optional().nullable(),
  imoNumber: z.string().optional().nullable(),
  capacityTeu: z
    .union([
      z.number().int("Capacity must be an integer").positive("Capacity must be positive"),
      z.string().transform((val) => {
        const num = parseInt(val);
        return isNaN(num) ? null : num;
      })
    ])
    .optional()
    .nullable()
});