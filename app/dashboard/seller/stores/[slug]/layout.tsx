import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/db";

export default async function SellerStoreLayout({children}: { children: React.ReactNode }) {
    const user = await currentUser()

    if (!user?.id) {
        redirect("/")
    }

    const store = await db.query.stores.findFirst({
        where: (store, {eq}) => eq(store.ownerId, user.id)
    })

    if (!store) {
        redirect("/dashboard/seller/stores/new")
    }

    redirect(`/dashboard/seller/stores/${store.slug}`)
    return (
        <>
            {children}
        </>
    )
}