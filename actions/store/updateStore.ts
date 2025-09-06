"use server"
import {
    getMissingStoreFields,
    PartialStoreSubmissionData,
    StoreSubmissionData,
    storeSubmissionSchema,
    validateCompleteStoreForm
} from "@/zodSchema/store";
import {currentUser} from "@clerk/nextjs/server";
import {NewStore, stores} from "@/db/schema";
import {db} from "@/db";
import {and, eq, ne, or} from "drizzle-orm";
import {revalidatePath} from "next/cache";

interface Response {
    statusCode: number,
    success: boolean,
    message: string
    data: NewStore | null
    redirectUrl?: string
}

export async function updateStore(storeId: number, data: PartialStoreSubmissionData): Promise<Response> {
    try {
        const user = await currentUser();
        if (!user) {
            return {
                statusCode: 401,
                success: false,
                message: "User not authenticated",
                data: null
            };
        }

        if (user.privateMetadata.role !== "SELLER") {
            return {
                statusCode: 403,
                success: false,
                message: "Unauthorized access. Only users with SELLER role can update stores",
                data: null
            };
        }

        if (!storeId) {
            return {
                statusCode: 400,
                success: false,
                message: "Store ID is required for update",
                data: null
            };
        }


        const existingStore = await db.select().from(stores)
            .where(eq(stores.id, storeId))
            .limit(1);

        if (existingStore.length === 0) {
            return {
                statusCode: 404,
                success: false,
                message: "Store not found",
                data: null
            };
        }

        if (existingStore[0].ownerId !== user.id) {
            return {
                statusCode: 403,
                success: false,
                message: "You don't have permission to update this store",
                data: null
            };
        }

        const oldSlug = existingStore[0].slug;

        if (!validateCompleteStoreForm(data)) {
            const missingFields = getMissingStoreFields(data);
            return {
                statusCode: 400,
                success: false,
                message: `Missing required fields: ${missingFields.join(', ')}`,
                data: null
            };
        }

        const validatedData = data as StoreSubmissionData;
        const parsedData = storeSubmissionSchema.parse(validatedData);
        const {name, slug, email, phone} = parsedData;

        const conflictingStore = await db.select().from(stores).where(
            and(
                or(
                    eq(stores.name, name),
                    eq(stores.slug, slug),
                    eq(stores.email, email),
                    eq(stores.phone, phone)
                ),
                ne(stores.id, storeId)
            )
        ).limit(1);

        if (conflictingStore.length > 0) {
            const existing = conflictingStore[0];
            if (existing.name === name) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Another store with this name already exists",
                    data: null
                };
            }
            if (existing.slug === slug) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Another store with this slug already exists",
                    data: null
                };
            }
            if (existing.email === email) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Another store with this email already exists",
                    data: null
                };
            }
            if (existing.phone === phone) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Another store with this phone number already exists",
                    data: null
                };
            }
        }

        const updatedStore = await db.update(stores)
            .set({
                ...parsedData,
            })
            .where(eq(stores.id, storeId))
            .returning();

        const newSlug = updatedStore[0].slug;


        let redirectUrl;
        if (newSlug && newSlug !== oldSlug) {
            revalidatePath(`/dashboard/seller/stores/${newSlug}/settings`);
            redirectUrl = `/dashboard/seller/stores/${newSlug}/settings`;
        }

        return {
            statusCode: 200,
            success: true,
            message: `Store ${updatedStore[0].name} updated successfully`,
            data: updatedStore[0],
            redirectUrl,
        };

    } catch (error) {
        console.error('Error updating store:', error);
        if (error instanceof Error && error.name === 'ZodError') {
            return {
                statusCode: 400,
                success: false,
                message: 'Invalid form data provided',
                data: null
            };
        }

        return {
            statusCode: 500,
            success: false,
            message: 'An error occurred while updating the store',
            data: null
        };
    }
}