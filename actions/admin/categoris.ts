"use server"
import {db} from "@/db";
import {categories} from "@/db/schema";
import {revalidatePath} from "next/cache";
import {eq} from "drizzle-orm";
import {CategoryFormData} from "@/zodSchema";

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


export async function getAllCategories() {
    try {

        return await db.query.categories.findMany({
            orderBy: (categories, {asc}) => [asc(categories.name)]
        })
    } catch (error) {
        console.error('Error fetching categories:', error)
        return []
    }
}


export async function deleteCategory(id: number) {
    try {
        await db.delete(categories).where(eq(categories.id, id))
        revalidatePath("/dashboard/admin/categories")
        return {
            statusCode: 200,
            success: true,
            message: 'Category deleted successfully'
        }
    } catch (error) {
        console.error('Error deleting category:', error)
        return {
            statusCode: 500,
            success: false,
            message: 'An error occurred while deleting the category'
        }
    }
}

export async function getCategoryById(id: number) {
    try {
        const category = await db.query.categories.findFirst({
            where: (categories, {eq}) => eq(categories.id, Number(id))
        })
        return category || null
    } catch (error) {
        console.error('Error fetching category by ID:', error)
        return null
    }
}

export async function updateCategory(id: number, data: CategoryFormData) {
    try {
        const {name, slug} = data

        const existingCategory = await db.query.categories.findFirst({
            where: (categories, {eq}) => eq(categories.name, name)
        })

        if (existingCategory && existingCategory.id !== Number(id)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Category with this name already exists'
            }
        }
        const existingSlug = await db.query.categories.findFirst({
            where: (categories, {eq}) => eq(categories.slug, slug)
        })
        if (existingSlug && existingSlug.id !== Number(id)) {
            return {
                statusCode: 400,
                success: false,
                message: 'Category with this slug already exists'
            }
        }
        await db.update(categories).set(data).where(eq(categories.id, Number(id)))
        revalidatePath("/dashboard/admin/categories")
        return {
            statusCode: 200,
            success: true,
            message: 'Category updated successfully'
        }
    } catch (error) {
        console.error('Error updating category:', error)
        return {
            statusCode: 500,
            success: false,
            message: 'An error occurred while updating the category'
        }
    }
}