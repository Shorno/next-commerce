"use server"

import {db} from "@/db";
import {currentUser} from "@clerk/nextjs/server";
import {ShippingRate, shippingRates, stores} from "@/db/schema";
import {and, eq} from "drizzle-orm";
import {ShippingDetailsFormData} from "@/zodSchema/store";
import {ShippingRateFormData} from "@/zodSchema/shippingRate";
import {revalidatePath} from "next/cache";


export interface StoreShippingDetails {
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

// export interface StoreShippingRate {
//     returnPolicy: string | null,
//     shippingService: string | null,
//     shippingCostPerItem: number | null,
//     shippingCostAdditionalItem: number | null,
//     shippingCostPerKg: number | null,
//     shippingCostFixed: number | null,
//     minimumDeliveryTime: number | null,
//     maximumDeliveryTime: number | null,
// }


export interface CountryWithShippingRate {
    countryId: number;
    countryCode: string;
    countryName: string;
    shippingRate: ShippingRate | null
}

export async function getStoreShippingDetails(slug: string): Promise<StoreShippingDetails | null> {
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

        revalidatePath(`/dashboard/seller/stores/${slug}/shipping`);

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

export async function getStoreShippingRates(slug: string): Promise<CountryWithShippingRate[]> {

    try {
        if (!slug || slug.trim().length === 0) {
            throw new Error('Invalid store slug');
        }

        const user = await currentUser();
        if (!user?.id) {
            throw new Error('Authentication required');
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
            throw new Error('Store not found or access denied');
        }

        const countries = await db.query.countries.findMany({
            orderBy: (countries, {asc}) => [asc(countries.name)],
        })

        const storeShippingRates = await db.query.shippingRates.findMany({
            where: eq(shippingRates.storeId, existingStore.id),
            with: {
                country: true
            },
        })

        const rateMap = new Map();
        storeShippingRates.forEach((rate) => {
            rateMap.set(rate.countryId, rate)
        })


        return countries.map((country) => ({
            countryId: country.id,
            countryCode: country.code,
            countryName: country.name,
            shippingRate: rateMap.get(country.id) || null,
        }));

    } catch (error) {
        console.error(error)
        return []
    }
}

export async function upsertShippingRate(
    storeSlug: string,
    countryId: number,
    data: ShippingRateFormData
): Promise<{ success: boolean; message: string }> {
    try {
        if (!storeSlug?.trim()) return {success: false, message: "Invalid store slug"};

        const user = await currentUser();
        if (!user?.id) return {success: false, message: "Authentication required"};

        // Find the store
        const store = await db.query.stores.findFirst({
            where: and(eq(stores.slug, storeSlug), eq(stores.ownerId, user.id)),
            columns: {id: true},
        });

        if (!store) return {success: false, message: "Store not found or access denied"};

        const payload = {
            shippingService: data.shippingService,
            shippingCostPerItem: data.shippingCostPerItem,
            shippingCostAdditionalItem: data.shippingCostAdditionalItem,
            shippingCostPerKg: data.shippingCostPerKg,
            shippingCostFixed: data.shippingCostFixed,
            minimumDeliveryTime: Number(data.minimumDeliveryTime),
            maximumDeliveryTime: Number(data.maximumDeliveryTime),
            returnPolicy: data.returnPolicy,
            storeId: store.id,
            countryId,
        };
        //
        // if (existingRate) {
        //     // Update existing rate
        //     await db.update(shippingRates)
        //         .set(payload)
        //         .where(eq(shippingRates.id, existingRate.id));
        //     return { success: true, message: "Shipping rate updated successfully" };
        // } else {
        //     // Insert new rate
        //     await db.insert(shippingRates).values(payload);
        //     return { success: true, message: "Shipping rate created successfully" };
        // }

        await db.insert(shippingRates).values(payload).onConflictDoUpdate({
            target: [shippingRates.storeId, shippingRates.countryId],
            set: payload
        })

        revalidatePath(`/dashboard/seller/stores/${storeSlug}/shipping`);

        return {
            success: true,
            message: `Shipping rate updated successfully`
        }

    } catch (error) {
        console.error("upsertShippingRate error:", error);
        return {success: false, message: "Failed to upsert shipping rate"};
    }
}