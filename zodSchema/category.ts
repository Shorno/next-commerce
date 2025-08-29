import {z} from "zod";

export const categorySchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required.",
    }).max(255, {
        message: "Category name must be less than 255 characters.",
    }),
    image: z.string().min(1, {
        message: "Image URL is required.",
    }),
    slug: z.string().min(1, {
        message: "Slug is required.",
    }).max(100, {
        message: "Slug must be less than 100 characters.",
    }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
    featured: z.boolean().default(false).nonoptional(),
})

export const subcategorySchema = categorySchema.extend({
    categoryId : z.number({
        message : "Category ID is required.",
    })
})


export type CategoryFormData = z.infer<typeof categorySchema>
export type SubcategoryFormData = z.infer<typeof subcategorySchema>