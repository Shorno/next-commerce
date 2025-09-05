"use server"
import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/db";
import {Store} from "@/db/schema";

export default async function getPendingStore(): Promise<Store | null> {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    const pendingStore = await db.query.stores.findFirst({
        where: (store, {eq, and}) => and(
            eq(store.ownerId, user.id),
            eq(store.status, "PENDING")
        )
    });
    if (!pendingStore) {
        return null;
    }
    return pendingStore;
}