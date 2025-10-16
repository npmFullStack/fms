import { z } from "zod";

export const incidentSchema = z.object({
  type: z.enum(['SEA', 'LAND'], {
    required_error: "Incident type is required",
    invalid_type_error: "Incident type must be SEA or LAND"
  }),
  description: z.string()
    .min(1, "Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  totalCost: z.coerce.number()
    .min(0, "Total cost must be a positive number")
    .max(99999999.99, "Total cost is too large"),
  bookingId: z.string()
    .uuid("Invalid booking ID")
    .min(1, "Booking is required"),
  image: z.any()
    .optional()
    .refine(
      (files) => !files || files.length === 0 || files[0]?.type?.startsWith('image/'), 
      "File must be an image"
    )
    .refine(
      (files) => !files || files.length === 0 || files[0]?.size <= 5 * 1024 * 1024,
      "Image must be less than 5MB"
    )
});

// Optional: Create a schema for update that makes fields optional
export const incidentUpdateSchema = incidentSchema.partial();