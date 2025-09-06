"use server"
import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/db";
import {NewStore, stores} from "@/db/schema";
import {eq, or} from "drizzle-orm";
import {
    PartialStoreSubmissionData,
    StoreSubmissionData,
    validateCompleteStoreForm,
    getMissingStoreFields,
    storeSubmissionSchema
} from "@/zodSchema/store";


interface Response {
    statusCode: number,
    success: boolean,
    message: string
    data: NewStore | null
}

export async function createStore(data: PartialStoreSubmissionData): Promise<Response> {
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
                message: "Unauthorized access. Only users with SELLER role can create stores",
                data: null
            };
        }

        // Validate that all required fields are present
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

        const existingStore = await db.select().from(stores).where(or(
            eq(stores.name, name),
            eq(stores.slug, slug),
            eq(stores.email, email),
            eq(stores.phone, phone)
        )).limit(1);

        if (existingStore.length > 0) {
            const existing = existingStore[0];
            if (existing.name === name) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Store with this name already exists",
                    data: null
                };
            }
            if (existing.slug === slug) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Store with this slug already exists",
                    data: null
                };
            }
            if (existing.email === email) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Store with this email already exists",
                    data: null
                };
            }
            if (existing.phone === phone) {
                return {
                    statusCode: 409,
                    success: false,
                    message: "Store with this phone number already exists",
                    data: null
                };
            }
        }

        // Insert the new store
        const newStore = await db.insert(stores).values({
            ...parsedData,
            ownerId: user.id
        }).returning();

        return {
            statusCode: 201,
            success: true,
            message: `Store ${newStore[0].name} created successfully`,
            data: newStore[0]
        };

    } catch (error) {
        console.error('Error creating store:', error);

        // Handle Zod validation errors specifically
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
            message: 'An error occurred while creating the store',
            data: null
        };
    }

}