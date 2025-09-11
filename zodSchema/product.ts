import { z } from "zod"

export const sizeSchema = z.object({
    size: z.string().min(1, "Size is required").nonoptional(),
    quantity: z.number().min(0, "Quantity must be 0 or greater").nonoptional(),
    price: z.number().min(0, "Price must be 0 or greater").nonoptional(),
    discount: z.number().min(0).max(100, "Discount must be between 0 and 100").default(0).nonoptional()
})

export const colorSchema = z.object({
    name: z.string().min(1, "Color name is required"),
    hexCode: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i, "Invalid hex color code")
        .optional(),
})

export const imageSchema = z.object({
    imageUrl: z.url("Invalid image URL").nonoptional(),
    altText: z.string().min(1, "Alt text is required").nonoptional(),
})

export const specSchema = z.object({
    name: z.string().min(1, "Spec name is required").nonoptional(),
    value: z.string().min(1, "Spec value is required").nonoptional(),
})

export const variantSchema = z.object({
    variantName: z.string().min(1, "Variant name is required"),
    variantDescription: z.string().min(1, "Variant description is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    sku: z.string().min(1, "SKU is required"),
    weight: z.number().min(0, "Weight must be 0 or greater"),
    price: z.number().min(0, "Price must be 0 or greater").optional(),
    keywords: z.string().min(1, "Keywords are required"),
    isSale: z.boolean().default(false).nonoptional(),
    saleEndDate: z.string().optional(),
    sizes: z.array(sizeSchema).default([]).nonoptional(),
    colors: z.array(colorSchema).default([]).nonoptional(),
    images: z.array(imageSchema).default([]).nonoptional(),
    specs: z.array(specSchema).default([]).nonoptional(),
})

export const productSchema = z.object({
    name: z.string().min(1, "Product name is required"),
    description: z.string().min(1, "Description is required"),
    slug: z
        .string()
        .min(1, "Slug is required")
        .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
    brand: z.string().min(1, "Brand is required"),
    image: z.url("Invalid image URL"),
    storeId: z.number().min(1, "Store is required"),
    categoryId: z.number().min(1, "Category is required"),
    subcategoryId: z.number().optional(),
    offerTagId: z.number().optional(),
    variants: z.array(variantSchema).min(1, "At least one variant is required"),
})

export type ProductFormData = z.infer<typeof productSchema>
export type VariantFormData = z.infer<typeof variantSchema>
// export type SizeFormData = z.infer<typeof sizeSchema>
// export type ColorFormData = z.infer<typeof colorSchema>
// export type ImageFormData = z.infer<typeof imageSchema>
// export type SpecFormData = z.infer<typeof specSchema>

