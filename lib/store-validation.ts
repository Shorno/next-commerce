import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/db";

export async function validateStoreAccess(slug: string) {
    const user = await currentUser();

    if (!user?.id) {
        return null;
    }

    return await db.query.stores.findFirst({
        where: (store, {and, eq}) => and(
            eq(store.slug, slug),
            eq(store.ownerId, user.id)
        )
    });
}
