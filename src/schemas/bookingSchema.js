// frontend/schemas/bookingSchema.js
import { z } from "zod";

const bookingModes = [
    "DOOR_TO_DOOR",
    "PIER_TO_PIER",
];

const statusTypes = [
    "PICKUP_SCHEDULED",
    "LOADED_TO_TRUCK",
    "ARRIVED_ORIGIN_PORT",
    "LOADED_TO_SHIP",
    "IN_TRANSIT",
    "ARRIVED_DESTINATION_PORT",
    "OUT_FOR_DELIVERY",
    "DELIVERED"
];

export const step1Schema = z.object({
    shipper: z.string().min(1, "Shipper is required"),
    first_name: z.string().optional().or(z.literal("")),
    last_name: z.string().optional().or(z.literal("")),
    phone: z.string().optional().or(z.literal("")),
    consignee: z.string().min(1, "Consignee is required"),
    consignee_name: z.string().optional().or(z.literal("")),
    consignee_phone: z.string().optional().or(z.literal("")),
    booking_date: z.string().min(1, "Booking date is required"),

});

export const step2Schema = z
    .object({
        shipping_line_id: z.string().uuid("Shipping line is required"),
        ship_id: z.string().uuid().optional().nullable(), // ✅ optional + nullable
        container_ids: z.array(z.string().uuid()).optional().default([]), // ✅ optional
        booking_mode: z.enum(bookingModes),
        commodity: z.string().min(2, "Commodity must be at least 2 characters"),
        quantity: z.coerce.number().int().positive(),
        origin_port: z.string().min(2, "Origin port is required"),
        destination_port: z.string().min(2, "Destination port is required")
    })
    .refine(
        data => {
            // If user selected containers, enforce match
            if (data.container_ids && data.container_ids.length > 0) {
                return data.container_ids.length === data.quantity;
            }
            return true;
        },
        {
            message: "Number of selected containers must match the quantity",
            path: ["container_ids"]
        }
    );

export const step3Schema = z.object({
  pickup_trucker_id: z.string().uuid().optional().nullable(),
  pickup_truck_id: z.string().uuid().optional().nullable(),
  delivery_trucker_id: z.string().uuid().optional().nullable(),
  delivery_truck_id: z.string().uuid().optional().nullable(),
  skipTrucking: z.boolean().optional().default(false)
});


export const step4Schema = z.object({
    pickup_location: z.string().optional(),
    delivery_location: z.string().optional(),
    pickup_province: z.string().optional().or(z.literal("")),
    pickup_city: z.string().optional().or(z.literal("")),
    pickup_barangay: z.string().optional().or(z.literal("")),
    pickup_street: z.string().optional().or(z.literal("")),
    delivery_province: z.string().optional().or(z.literal("")),
    delivery_city: z.string().optional().or(z.literal("")),
    delivery_barangay: z.string().optional().or(z.literal("")),
    delivery_street: z.string().optional().or(z.literal(""))
});

export const step5Schema = z.object({
    status: z.enum(statusTypes).default("PICKUP_SCHEDULED") 
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
    step5Schema
];
