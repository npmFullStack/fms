// frontend/schemas/bookingSchema.js
import { z } from "zod";

const bookingModes = [
  "DOOR_TO_DOOR",
  "PIER_TO_PIER",
  "CY_TO_DOOR",
  "DOOR_TO_CY",
  "CY_TO_CY",
];

const statusTypes = [
  "PENDING",
  "PICKUP",
  "IN_PORT",
  "IN_TRANSIT",
  "DELIVERED",
];

export const step1Schema = z.object({
  booking_date: z.string().min(1, "Booking date is required"),
  shipper: z.string().min(1, "Shipper is required"),
  first_name: z.string().optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

export const step2Schema = z.object({
  shipping_line_id: z.string().min(1, "Shipping line is required"),
  ship_id: z.string().min(1, "Ship is required"),
  container_id: z.string().min(1, "Container is required"), // ✅ now required
  quantity: z.coerce.number().int().min(1),
  booking_mode: z.enum(bookingModes),
  commodity: z.string().min(1),
  origin_port: z.string().min(1),
  destination_port: z.string().min(1),
});

export const step3Schema = z.object({
  pickup_trucker_id: z.string().optional().or(z.literal("")),
  pickup_truck_id: z.string().optional().or(z.literal("")),
  delivery_trucker_id: z.string().optional().or(z.literal("")),
  delivery_truck_id: z.string().optional().or(z.literal("")),
});

export const step4Schema = z.object({
  pickup_location: z.string().optional(),
  delivery_location: z.string().optional(),
  pickup_lat: z.number().optional().nullable(),
  pickup_lng: z.number().optional().nullable(),
  delivery_lat: z.number().optional().nullable(),
  delivery_lng: z.number().optional().nullable(),
});

export const step5Schema = z.object({
  preferred_departure: z.string().min(1, "Preferred departure is required"),
  preferred_delivery: z.string().optional().or(z.literal("")),
  status: z.enum(statusTypes).default("PENDING"),
});

export const bookingSchema = step1Schema
  .merge(step2Schema)
  .merge(step3Schema)
  .merge(step4Schema)
  .merge(step5Schema);

export const stepSchemas = [
  step1Schema,
  step2Schema,
  step3Schema,
  step4Schema,
  step5Schema,
];
