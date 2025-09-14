"use server"

import {db} from "@/db";
import {currentUser} from "@clerk/nextjs/server";
import {stores} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {ShippingDetailsFormData} from "@/zodSchema/store";


export interface ShippingDetails {
    returnPolicy: string | null,
    defaultShippingService: string | null
    defaultShippingCost: string | null
    defaultShippingCostPerItem: string | null
    defaultShippingCostAdditionalItem: string | null
    defaultShippingCostPerKg: string | null
    defaultShippingCostFixed: string | null
    minimumDeliveryTime: number | null
    maximumDeliveryTime: number | null
}

export async function getStoreShippingDetails(slug: string): Promise<ShippingDetails | null> {
    try {
        if (!slug || slug.trim().length === 0) {
            throw new Error("Invalid store slug");
        }


        const user = await currentUser();
        if (!user?.id) {
            throw new Error("Authentication required");
        }

        const shippingDetails = await db.query.stores.findFirst({
            where: and(
                eq(stores.slug, slug),
                eq(stores.ownerId, user.id)
            ),
            columns: {
                returnPolicy: true,
                defaultShippingService: true,
                defaultShippingCost: true,
                defaultShippingCostPerItem: true,
                defaultShippingCostAdditionalItem: true,
                defaultShippingCostPerKg: true,
                defaultShippingCostFixed: true,
                minimumDeliveryTime: true,
                maximumDeliveryTime: true,
            }
        });

        if (!shippingDetails) {
            throw new Error("Store not found or access denied");
        }

        return shippingDetails ?? null

    } catch (error) {

        console.error('getStoreShippingDetails error:', {
            slug,
            error: error instanceof Error ? error.message : 'Unknown error',
        });
        throw error;
    }
}

export async function updateStoreShippingDetails(slug: string, data: ShippingDetailsFormData): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        if (!slug || slug.trim().length === 0) {
            return {success: false, message: "Invalid store slug"};
        }

        const user = await currentUser();
        if (!user?.id) {
            return {success: false, message: "Authentication required"};
        }

        const existingStore = await db.query.stores.findFirst({
            where: and(
                eq(stores.slug, slug),
                eq(stores.ownerId, user.id)
            ),
            columns: {
                id: true
            }
        });

        if (!existingStore) {
            return {success: false, message: "Store not found or access denied"};
        }

        await db.update(stores)
            .set(data)
            .where(and(
                eq(stores.slug, slug),
                eq(stores.ownerId, user.id)
            ));

        return {
            success: true,
            message: "Shipping details updated successfully"
        };

    } catch (error) {
        console.error('updateStoreShippingDetails error:', {
            slug,
            error: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
        });

        return {
            success: false,
            message: "Failed to update shipping details. Please try again."
        };
    }
}