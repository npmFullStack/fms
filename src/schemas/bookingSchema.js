import { z } from "zod";

// --------------------------------------------------
// Shared enums and reusable validators
// --------------------------------------------------
const containerTypes = ["LCL", "20FT", "40FT"];
const bookingModes = [
  "DOOR_TO_DOOR",
  "PIER_TO_PIER",
  "CY_TO_DOOR",
  "DOOR_TO_CY",
  "CY_TO_CY",
];

// --------------------------------------------------
// Step-based schemas
// --------------------------------------------------

// Step 1: Customer Details
export const step1Schema = z.object({
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  phone: z.string().optional().nullable(),
});

// Step 2: Shipping Details
export const step2Schema = z.object({
  shipping_line_id: z
    .string()
    .uuid({ message: "Invalid shipping line ID" }),
  ship_id: z
    .string()
    .uuid({ message: "Invalid ship ID" })
    .optional()
    .nullable(),
  container_type: z.enum(containerTypes, {
    message: "Invalid container type",
  }),
  booking_mode: z.enum(bookingModes, {
    message: "Invalid booking mode",
  }),
});

// Step 3: Route & Dates
export const step3Schema = z.object({
  origin: z
    .string()
    .min(2, { message: "Origin must be at least 2 characters" }),
  destination: z
    .string()
    .min(2, { message: "Destination must be at least 2 characters" }),
  pickup_lat: z.number().optional().nullable(),
  pickup_lng: z.number().optional().nullable(),
  delivery_lat: z.number().optional().nullable(),
  delivery_lng: z.number().optional().nullable(),
  preferred_departure: z
    .string()
    .min(1, { message: "Preferred departure is required" }),
  preferred_delivery: z.string().optional().nullable(),
});

// Step 4: Cargo Details
export const step4Schema = z.object({
  commodity: z
    .string()
    .min(2, { message: "Commodity must be at least 2 characters" }),
  quantity: z
    .number()
    .int()
    .positive({ message: "Quantity must be a positive integer" })
    .default(1),
});

// Step 5: Financials
export const step5Schema = z.object({
  freight_charge: z
    .number()
    .nonnegative({ message: "Freight charge cannot be negative" })
    .optional()
    .nullable(),
  trucking_charge: z
    .number()
    .nonnegative({ message: "Trucking charge cannot be negative" })
    .optional()
    .nullable(),
  total_amount: z
    .number()
    .nonnegative({ message: "Total amount cannot be negative" })
    .optional()
    .nullable(),
});

// --------------------------------------------------
// Full schema for submission
// --------------------------------------------------
export const bookingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

// Partial schema for updates (all fields optional)
export const bookingUpdateSchema = bookingSchema.partial();

// Array of step schemas for multi-step validation
export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
];
