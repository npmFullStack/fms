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
  shipper: z.string().min(1, "Shipper is required"),
  first_name: z.string().optional().or(z.literal("")),
  last_name: z.string().optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
  // Consignee fields
  consignee: z.string().min(1, "Consignee is required"),
  consignee_name: z.string().optional().or(z.literal("")),
  consignee_phone: z.string().optional().or(z.literal("")),
  preferred_departure: z.string().min(1, "Preferred departure is required"),
  preferred_delivery: z.string().optional().or(z.literal("")),
});

export const step2Schema = z.object({
  shipping_line_id: z.string().min(1, "Shipping line is required"),
  container_ids: z.array(z.string().uuid()).min(1, "At least one container is required"),
  quantity: z.coerce.number().int().min(1).max(10),
  booking_mode: z.enum(bookingModes),
  commodity: z.string().min(1),
  origin_port: z.string().min(1),
  destination_port: z.string().min(1),
}).refine((data) => {
  return data.container_ids.length === data.quantity;
}, {
  message: "Number of selected containers must match the quantity",
  path: ["container_ids"],
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
  pickup_province: z.string().optional(),
  pickup_city: z.string().optional(),
  pickup_barangay: z.string().optional(),
  pickup_street: z.string().optional(),
  delivery_province: z.string().optional(),
  delivery_city: z.string().optional(),
  delivery_barangay: z.string().optional(),
  delivery_street: z.string().optional(),
  pickup_lat: z.number().optional().nullable(),
  pickup_Ing: z.number().optional().nullable(),
  delivery_lat: z.number().optional().nullable(),
  delivery_Ing: z.number().optional().nullable(),
});

export const step5Schema = z.object({
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