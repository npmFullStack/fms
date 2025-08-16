import { z } from "zod";

export const partnerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  logoUrl: z.string().url("Invalid URL").optional().nullable(),
  contactEmail: z.string().email("Invalid email").optional().nullable(),
  contactPhone: z.string().optional().nullable(),
  website: z.string().url("Invalid URL").optional().nullable(),
  serviceRoutes: z.array(z.string()).optional()
});

export const shippingLineSchema = partnerSchema;
export const truckingCompanySchema = partnerSchema.extend({
  serviceRoutes: z.array(z.string()).min(1, "At least one service route is required")
});