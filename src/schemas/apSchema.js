// frontend/schemas/apSchema.js
import { z } from "zod";

export const createAPSchema = z.object({
    bookingId: z.string().uuid("Valid booking ID is required")
});

export const freightSchema = z.object({
    amount: z.number().min(0, "Amount must be positive").default(0),
    checkDate: z.string().optional().nullable(),
    voucher: z.string().min(1, "Voucher is required").optional().nullable()
});

export const truckingSchema = z.object({
    type: z.enum(["ORIGIN", "DESTINATION"], {
        required_error: "Trucking type is required"
    }),
    amount: z.number().min(0, "Amount must be positive").default(0),
    checkDate: z.string().optional().nullable(),
    voucher: z.string().min(1, "Voucher is required").optional().nullable()
});

export const portChargeSchema = z.object({
    chargeType: z.enum([
        "CRAINAGE", 
        "ARRASTRE_ORIGIN", 
        "ARRASTRE_DEST", 
        "WHARFAGE_ORIGIN", 
        "WHARFAGE_DEST", 
        "LABOR_ORIGIN", 
        "LABOR_DEST"
    ], {
        required_error: "Valid port charge type is required"
    }),
    payee: z.string().min(1, "Payee is required").optional().nullable(),
    amount: z.number().min(0, "Amount must be positive").default(0),
    checkDate: z.string().optional().nullable(),
    voucher: z.string().min(1, "Voucher is required").optional().nullable()
});

export const miscChargeSchema = z.object({
    chargeType: z.enum([
        "REBATES", 
        "STORAGE", 
        "FACILITATION", 
        "DENR"
    ], {
        required_error: "Valid misc charge type is required"
    }),
    payee: z.string().min(1, "Payee is required").optional().nullable(),
    amount: z.number().min(0, "Amount must be positive").default(0),
    checkDate: z.string().optional().nullable(),
    voucher: z.string().min(1, "Voucher is required").optional().nullable()
});

// Update schemas (omit type fields since they can't be changed)
export const updateFreightSchema = freightSchema;
export const updateTruckingSchema = freightSchema.omit({ type: true });
export const updatePortChargeSchema = portChargeSchema.omit({ chargeType: true });
export const updateMiscChargeSchema = miscChargeSchema.omit({ chargeType: true });

// Complete AP form schema for the modal
export const updateAPFormSchema = z.object({
    // Freight
    freight_amount: z.number().min(0, "Amount must be positive").default(0),
    freight_check_date: z.string().optional().nullable(),
    freight_voucher: z.string().optional().nullable(),

    // Trucking Origin
    trucking_origin_amount: z.number().min(0, "Amount must be positive").default(0),
    trucking_origin_check_date: z.string().optional().nullable(),
    trucking_origin_voucher: z.string().optional().nullable(),

    // Trucking Destination
    trucking_dest_amount: z.number().min(0, "Amount must be positive").default(0),
    trucking_dest_check_date: z.string().optional().nullable(),
    trucking_dest_voucher: z.string().optional().nullable(),

    // Port Charges
    crainage_amount: z.number().min(0, "Amount must be positive").default(0),
    crainage_check_date: z.string().optional().nullable(),
    crainage_voucher: z.string().optional().nullable(),

    arrastre_origin_amount: z.number().min(0, "Amount must be positive").default(0),
    arrastre_origin_check_date: z.string().optional().nullable(),
    arrastre_origin_voucher: z.string().optional().nullable(),

    arrastre_dest_amount: z.number().min(0, "Amount must be positive").default(0),
    arrastre_dest_check_date: z.string().optional().nullable(),
    arrastre_dest_voucher: z.string().optional().nullable(),

    wharfage_origin_amount: z.number().min(0, "Amount must be positive").default(0),
    wharfage_origin_check_date: z.string().optional().nullable(),
    wharfage_origin_voucher: z.string().optional().nullable(),

    wharfage_dest_amount: z.number().min(0, "Amount must be positive").default(0),
    wharfage_dest_check_date: z.string().optional().nullable(),
    wharfage_dest_voucher: z.string().optional().nullable(),

    labor_origin_amount: z.number().min(0, "Amount must be positive").default(0),
    labor_origin_check_date: z.string().optional().nullable(),
    labor_origin_voucher: z.string().optional().nullable(),

    labor_dest_amount: z.number().min(0, "Amount must be positive").default(0),
    labor_dest_check_date: z.string().optional().nullable(),
    labor_dest_voucher: z.string().optional().nullable(),

    // Misc Charges
    rebates_amount: z.number().min(0, "Amount must be positive").default(0),
    rebates_check_date: z.string().optional().nullable(),
    rebates_voucher: z.string().optional().nullable(),

    storage_amount: z.number().min(0, "Amount must be positive").default(0),
    storage_check_date: z.string().optional().nullable(),
    storage_voucher: z.string().optional().nullable(),

    facilitation_amount: z.number().min(0, "Amount must be positive").default(0),
    facilitation_check_date: z.string().optional().nullable(),
    facilitation_voucher: z.string().optional().nullable(),
});

export default updateAPFormSchema;