"use server";

import { db } from "@/db";
import {subcategories } from "@/db/schema";
import { revalidatePath } from "next/cache";
import {eq, sql} from "drizzle-orm";
import { SubcategoryFormData } from "@/zodSchema/category";

interface Response {
    statusCode: number;
    success: boolean;
    message: string;
}

export async function createSubcategory(data: SubcategoryFormData): Promise<Response> {
    try {
        const { name, slug, categoryId } = data;

        const parent = await db.query.categories.findFirst({
            where: (c, { eq }) => eq(c.id, Number(categoryId)),
        });
        if (!parent) {
            return {
                statusCode: 404,
                success: false,
                message: "Parent category not found",
            };
        }

        const existingByName = await db.query.subcategories.findFirst({
            where: (sc, { and, eq }) => and(eq(sc.categoryId, Number(categoryId)), eq(sc.name, name)),
        });
        if (existingByName) {
            return {
                statusCode: 400,
                success: false,
                message: "Subcategory with this name already exists in this category",
            };
        }

        const existingBySlug = await db.query.subcategories.findFirst({
            where: (sc, { and, eq }) => and(eq(sc.categoryId, Number(categoryId)), eq(sc.slug, slug)),
        });
        if (existingBySlug) {
            return {
                statusCode: 400,
                success: false,
                message: "Subcategory with this slug already exists in this category",
            };
        }

        const response = await db.insert(subcategories).values(data).returning();

        revalidatePath("/dashboard/admin/subcategories");
        revalidatePath("/dashboard/admin/categories");

        return {
            statusCode: 201,
            success: true,
            message: `Subcategory ${response[0].name} created successfully`,
        };
    } catch (error) {
        console.error("Error creating subcategory:", error);
        return {
            statusCode: 500,
            success: false,
            message: "An error occurred while creating the subcategory",
        };
    }
}

export async function getAllSubcategories() {
    try {
        return await db.query.subcategories.findMany({
            with: { category: true },
            orderBy: (sc, { asc }) => [asc(sc.name)],
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return [];
    }
}

export async function getRandomSubCategories() {
    try {
        return await db.query.subcategories.findMany({
            with: { category: true },
            orderBy: () => sql`RANDOM()`,
            limit : 5,
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return [];
    }
}


export async function getSubcategoriesByCategory(categoryId: number) {
    try {
        return await db.query.subcategories.findMany({
            where: (sc, { eq }) => eq(sc.categoryId, categoryId),
            with: { category: true },
            orderBy: (sc, { asc }) => [asc(sc.name)],
        });
    } catch (error) {
        console.error("Error fetching subcategories:", error);
        return [];
    }
}


export async function getSubcategoryById(id: number) {
    try {
        return await db.query.subcategories.findFirst({
            where: (sc, { eq }) => eq(sc.id, Number(id)),
            with: { category: true },
        });
    } catch (error) {
        console.error("Error fetching subcategory by ID:", error);
        return null;
    }
}

export async function updateSubcategory(id: number, data: SubcategoryFormData): Promise<Response> {
    try {
        const { name, slug, categoryId } = data;

        const parent = await db.query.categories.findFirst({
            where: (c, { eq }) => eq(c.id, Number(categoryId)),
        });
        if (!parent) {
            return {
                statusCode: 404,
                success: false,
                message: "Parent category not found",
            };
        }

        const conflictByName = await db.query.subcategories.findFirst({
            where: (sc, { and, eq, ne }) =>
                and(eq(sc.categoryId, Number(categoryId)), eq(sc.name, name), ne(sc.id, Number(id))),
        });
        if (conflictByName) {
            return {
                statusCode: 400,
                success: false,
                message: "Subcategory with this name already exists in this category",
            };
        }

        const conflictBySlug = await db.query.subcategories.findFirst({
            where: (sc, { and, eq, ne }) =>
                and(eq(sc.categoryId, Number(categoryId)), eq(sc.slug, slug), ne(sc.id, Number(id))),
        });
        if (conflictBySlug) {
            return {
                statusCode: 400,
                success: false,
                message: "Subcategory with this slug already exists in this category",
            };
        }

        await db.update(subcategories).set(data).where(eq(subcategories.id, Number(id)));

        revalidatePath("/dashboard/admin/subcategories");
        revalidatePath("/dashboard/admin/categories");

        return {
            statusCode: 200,
            success: true,
            message: "Subcategory updated successfully",
        };
    } catch (error) {
        console.error("Error updating subcategory:", error);
        return {
            statusCode: 500,
            success: false,
            message: "An error occurred while updating the subcategory",
        };
    }
}

export async function deleteSubcategory(id: number): Promise<Response> {
    try {
        await db.delete(subcategories).where(eq(subcategories.id, Number(id)));

        revalidatePath("/dashboard/admin/subcategories");
        revalidatePath("/dashboard/admin/categories");

        return {
            statusCode: 200,
            success: true,
            message: "Subcategory deleted successfully",
        };
    } catch (error) {
        console.error("Error deleting subcategory:", error);
        return {
            statusCode: 500,
            success: false,
            message: "An error occurred while deleting the subcategory",
        };
    }
}
