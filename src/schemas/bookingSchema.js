// schemas/bookingSchema.js
import { z } from "zod";

export const bookingSchema = z.object({
    // Customer details (instead of customer_id)
    first_name: z.string().min(1, { message: "First name is required" }),
    last_name: z.string().min(1, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email address" }).optional().or(z.literal("")),
    phone: z.string().optional().nullable(),

    // Shipping details
    shipping_line_id: z.string().uuid({ message: "Invalid shipping line ID" }),
    ship_id: z
        .string()
        .uuid({ message: "Invalid ship ID" })
        .optional()
        .nullable(),
    container_type: z.enum(["LCL", "20FT", "40FT"], {
        message: "Invalid container type"
    }),
    booking_mode: z.enum(
        [
            "DOOR_TO_DOOR",
            "PIER_TO_PIER",
            "CY_TO_DOOR",
            "DOOR_TO_CY",
            "CY_TO_CY"
        ],
        {
            message: "Invalid booking mode"
        }
    ),

    // Route details
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

    // Cargo details
    commodity: z
        .string()
        .min(2, { message: "Commodity must be at least 2 characters" }),
    quantity: z
        .number()
        .int()
        .positive({ message: "Quantity must be a positive integer" })
        .default(1),

    // Financials
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
        .nullable()
});

export const bookingUpdateSchema = bookingSchema.partial();
