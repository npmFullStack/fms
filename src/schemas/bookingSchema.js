import { z } from "zod";

// Allowed values
const containerTypes = ["LCL", "20FT", "40FT"];
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
  "COMPLETED",
];

/**
 * STEP 1: Shipper / Customer Info
 * Includes auto-generated numbers (optional, filled after backend insert)
 */
export const step1Schema = z.object({
  hwb_number: z.string().optional().nullable(),
  booking_number: z.string().optional().nullable(),
  shipper: z.string().min(1, { message: "Shipper is required" }),
  first_name: z.string().min(1, { message: "First name is required" }),
  last_name: z.string().min(1, { message: "Last name is required" }),
  email: z
    .string()
    .email({ message: "Invalid email" })
    .optional()
    .or(z.literal("")),
  phone: z.string().min(1, { message: "Phone is required" }),
});

/**
 * STEP 2: Shipping Details (ship, ports, container, commodity, mode)
 */
export const step2Schema = z.object({
  shipping_line_id: z.string().min(1, { message: "Shipping line is required" }),
  ship_id: z.string().min(1, { message: "Ship is required" }),
  container_type: z.enum(containerTypes, { message: "Invalid container type" }),
  quantity: z
    .coerce.number()
    .int()
    .min(1, { message: "Quantity must be at least 1" }),
  booking_mode: z.enum(bookingModes, { message: "Invalid booking mode" }),
  commodity: z.string().min(1, { message: "Commodity is required" }),
  origin_port: z.string().min(1, { message: "Origin port is required" }),
  destination_port: z
    .string()
    .min(1, { message: "Destination port is required" }),
});

/**
 * STEP 3: Trucking (optional, depends on booking mode)
 */
export const step3Schema = z.object({
  pickup_trucker_id: z.string().optional().or(z.literal("")),
  pickup_truck_id: z.string().optional().or(z.literal("")),
  delivery_trucker_id: z.string().optional().or(z.literal("")),
  delivery_truck_id: z.string().optional().or(z.literal("")),
});

/**
 * STEP 4: Locations & Map
 * Pickup/Delivery only required for DOOR_TO_DOOR mode.
 */
export const step4Schema = z.object({
  pickup_location: z.string().optional(),
  delivery_location: z.string().optional(),
  pickup_lat: z.number().optional(),
  pickup_lng: z.number().optional(),
  delivery_lat: z.number().optional(),
  delivery_lng: z.number().optional(),
});

/**
 * STEP 5: Dates & Other Info
 */
export const step5Schema = z.object({
  preferred_departure: z
    .string()
    .min(1, { message: "Preferred departure is required" }),
  preferred_delivery: z.string().optional().or(z.literal("")),
  van_number: z.string().optional().or(z.literal("")),
  seal_number: z.string().optional().or(z.literal("")),
  status: z.enum(statusTypes, { message: "Invalid status" }).default("PENDING"),
});

/**
 * Full schema for submission
 */
export const bookingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

/**
 * Step schemas for wizard validation
 */
export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
];
