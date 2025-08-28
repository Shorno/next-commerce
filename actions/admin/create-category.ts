"use server"
import {CategoryFormData} from "@/components/admin-dashboard/category-form";
import {db} from "@/db";
import {categories} from "@/db/schema";
import {revalidatePath} from "next/cache";

interface Response {
    statusCode: number,
    success: boolean,
    message: string
}

export async function createCategory(data: CategoryFormData): Promise<Response> {
    try {
        const {name, slug} = data

        const existingCategory = await db.query.categories.findFirst({
            where: (categories, {eq}) => eq(categories.name, name)
        })

        if (existingCategory) {
            return {
                statusCode: 400,
                success: false,
                message: 'Category with this name already exists'
            }
        }

        const existingSlug = await db.query.categories.findFirst({
            where: (categories, {eq}) => eq(categories.slug, slug)
        })

        if (existingSlug) {
            return {
                statusCode: 400,
                success: false,
                message: 'Category with this slug already exists'
            }
        }

        const response = await db.insert(categories).values(data).returning();


        revalidatePath("/dashboard/admin/categories")

        return {
            statusCode: 201,
            success: true,
            message: `Category ${response[0].name} created successfully`
        }
    } catch (error) {
        console.error('Error creating category:', error);
        return {
            statusCode: 500,
            success: false,
            message: 'An error occurred while creating the category'
        }
    }

}


