"use server"
import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/db";

export default async function getPendingStore() {
    const user = await currentUser();
    if (!user) {
        return null;
    }

    return await db.query.stores.findMany({
        where: (store, {eq, and}) => and(
            eq(store.ownerId, user.id),
            eq(store.status, "PENDING")
        )
    });
}