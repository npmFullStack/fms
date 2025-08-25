import { z } from "zod";

export const shipSchema = z.object({
  shippingLineId: z.string().uuid("Invalid Shipping Line ID"),
  name: z.string().min(1, "Ship name is required"),
  vesselNumber: z.string().optional().nullable(),
  routes: z.array(
    z.object({
      origin: z
        .object({
          value: z.string(),
          label: z.string()
        })
        .nullable()
        .refine((val) => val !== null, { message: "Origin is required" }),
      destination: z
        .object({
          value: z.string(),
          label: z.string()
        })
        .nullable()
        .refine((val) => val !== null, { message: "Destination is required" }),
      pricing: z
        .array(
          z.object({
            type: z.enum(["LCL", "20FT", "40FT"]),
            price: z
              .string()
              .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
                message: "Price must be a valid number and not negative",
              }),
          })
        )
        .length(3, { message: "Pricing must include LCL, 20FT, and 40FT" }),
    })
  ).min(1, { message: "At least one route is required" }),
});
