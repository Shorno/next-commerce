"use server"
import {db} from "@/db";
import {currentUser} from "@clerk/nextjs/server";

export async function getActiveStores() {
    const user = await currentUser();
    if (!user) {
        throw new Error("User not authenticated");
    }
    return await db.query.stores.findMany({
        where: (store, {eq, and}) => and(
            eq(store.ownerId, user.id),
            eq(store.status, "ACTIVE")
        )
    })
}

