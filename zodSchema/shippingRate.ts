import { z } from "zod"

export const shippingRateSchema = z.object({
    shippingService: z.string().min(1, "Shipping service is required"),

    shippingCostPerItem: z.string().optional(),
    shippingCostAdditionalItem: z.string().optional(),
    shippingCostPerKg: z.string().optional(),
    shippingCostFixed: z.string().optional(),

    minimumDeliveryTime: z.string().optional(),
    maximumDeliveryTime: z.string().optional(),

    returnPolicy: z.string().optional(),
})
export type ShippingRateFormData = z.infer<typeof shippingRateSchema>
