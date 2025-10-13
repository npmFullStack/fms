// schemas/arSchema.js
import { z } from "zod";

export const updateARFormSchema = z.object({
  amount_paid: z.string().min(1, "Amount is required")
    .refine(val => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "Amount must be a valid number"
    }),
  payment_date: z.string().optional().nullable()
});