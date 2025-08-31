import {z} from "zod";

export const storeSchema = z.object({
    name: z
        .string()
        .min(2, "Store name must be at least 2 characters")
        .max(255, "Store name cannot exceed 255 characters")
        .trim(),
    slug: z
        .string()
        .min(2, "URL slug must be at least 2 characters")
        .max(100, "URL slug cannot exceed 100 characters")
        .regex(/^[a-z0-9-]+$/, "URL slug can only contain lowercase letters, numbers, and hyphens")
        .trim(),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description cannot exceed 1000 characters")
        .trim(),


    logo: z
        .url("Please upload a valid logo")
        .min(1, "Store logo is required"),

    cover: z
        .url("Please upload a valid cover image")
        .min(1, "Cover image is required"),


    featured: z.boolean().default(false).nonoptional(),


    email: z
        .email("Please enter a valid email address")
        .max(100, "Email cannot exceed 100 characters")
        .trim(),

    phone: z
        .string()
        .min(10, "Phone number must be at least 10 characters")
        .max(15, "Phone number cannot exceed 15 characters")
        .regex(/^[+]?[\d\s\-()]+$/, "Please enter a valid phone number")
        .trim(),



    defaultShippingService: z
        .string()
        .max(255, "Shipping service name cannot exceed 255 characters")
        .optional()
        .or(z.literal(""))
        .nonoptional(),

    defaultShippingCost: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, "Please enter a valid price (e.g., 10.50)")
        .optional()
        .or(z.literal(""))
        .transform((val) => val === "" ? "0" : val)
        .nonoptional()
    ,
    minimumDeliveryTime: z
        .number()
        .min(0, "Minimum delivery time cannot be negative")
        .max(365, "Minimum delivery time cannot exceed 365 days")
        .default(0)
        .nonoptional()
    ,
    maximumDeliveryTime: z
        .number()
        .min(0, "Maximum delivery time cannot be negative")
        .max(365, "Maximum delivery time cannot exceed 365 days")
        .default(0)
        .nonoptional()
    ,
    returnPolicy: z
        .string()
        .max(2000, "Return policy cannot exceed 2000 characters")
        .optional()
        .or(z.literal("")),


}).refine((data) => {
    if (data.minimumDeliveryTime > 0 && data.maximumDeliveryTime > 0) {
        return data.minimumDeliveryTime <= data.maximumDeliveryTime;
    }
    return true;
}, {
    message: "Maximum delivery time must be greater than or equal to minimum delivery time",
    path: ["maximumDeliveryTime"],
},);

export const basicInfoSchema = storeSchema.pick({
    logo: true,
    name: true,
    slug: true,
    description: true,
})



export const storeContactSchema = storeSchema.pick({
    cover: true,
    email: true,
    phone: true,
})

export const storePolicySchema = storeSchema.pick({
    defaultShippingService: true,
    defaultShippingCost: true,
    minimumDeliveryTime: true,
    maximumDeliveryTime: true,
    returnPolicy: true
})


export type StoreFormData = z.infer<typeof storeSchema>;

export type  BasicInfoFormData = z.infer<typeof basicInfoSchema>;
export type  StoreContactFormData = z.infer<typeof storeContactSchema>;
export type  StorePolicyFormData = z.infer<typeof storePolicySchema>;