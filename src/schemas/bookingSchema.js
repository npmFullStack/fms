import { z } from "zod";

// --------------------------------------------------
// Shared enums and reusable validators
// --------------------------------------------------
const containerTypes = ["LCL", "20FT", "40FT", "40FT_HC"];
const bookingModes = [
  "DOOR_TO_DOOR",
  "PIER_TO_PIER", 
  "CY_TO_DOOR",
  "DOOR_TO_CY",
  "CY_TO_CY",
];
const statusTypes = [
  "PENDING",
  "CONFIRMED", 
  "IN_TRANSIT",
  "ARRIVED",
  "DELIVERED",
  "COMPLETED"
];

// --------------------------------------------------
// Step-based schemas
// --------------------------------------------------

// Step 1: Customer Details (removed hwb_number)
export const step1Schema = z.object({
  shipper: z.string().min(1, { message: "Shipper is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email address" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, { message: "Phone number is required" }),
});

// Step 2: Shipping Details (added trucker_id)
export const step2Schema = z.object({
  shipping_line_id: z
    .string()
    .min(1, { message: "Shipping line is required" }),
  ship_id: z
    .string()
    .min(1, { message: "Ship is required" }),
  container_type: z.enum(containerTypes, {
    message: "Invalid container type",
  }),
  booking_mode: z.enum(bookingModes, {
    message: "Invalid booking mode",
  }),
  trucker_id: z.string().optional().or(z.literal("")),
});

// Step 3: Route & Locations (updated field names to match component)
export const step3Schema = z.object({
  origin: z
    .string()
    .min(1, { message: "Origin is required" }),
  destination: z
    .string()
    .min(1, { message: "Destination is required" }),
  origin_lat: z
    .string()
    .min(1, { message: "Origin latitude is required" })
    .or(z.number()),
  origin_lng: z
    .string()
    .min(1, { message: "Origin longitude is required" })
    .or(z.number()),
  destination_lat: z
    .string()
    .min(1, { message: "Destination latitude is required" })
    .or(z.number()),
  destination_lng: z
    .string()
    .min(1, { message: "Destination longitude is required" })
    .or(z.number()),
});

// Step 4: Dates & Cargo Details
export const step4Schema = z.object({
  preferred_departure: z
    .string()
    .min(1, { message: "Preferred departure is required" }),
  preferred_delivery: z.string().optional().or(z.literal("")),
  commodity: z
    .string()
    .min(1, { message: "Commodity is required" }),
  quantity: z
    .number()
    .int()
    .min(1, { message: "Quantity must be at least 1" })
    .default(1),
  van_number: z.string().optional().or(z.literal("")),
  seal_number: z.string().optional().or(z.literal("")),
});

// Step 5: Pricing & Status
export const step5Schema = z.object({
  freight_charge: z
    .number()
    .min(0, { message: "Freight charge cannot be negative" })
    .default(0),
  trucking_charge: z
    .number()
    .min(0, { message: "Trucking charge cannot be negative" })
    .default(0),
  total_amount: z
    .number()
    .min(0, { message: "Total amount cannot be negative" })
    .optional(),
  status: z.enum(statusTypes, {
    message: "Invalid status",
  }),
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