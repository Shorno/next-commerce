"use server"
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/db";

export default async function getActiveStore() {
    const user = await currentUser()

    if (!user) {
        redirect("/")
    }

    return await db.query.stores.findFirst({
        where: (store, {eq, and}) => and(
            eq(store.ownerId, user.id),
            eq(store.status, "ACTIVE")
        )
    })

}