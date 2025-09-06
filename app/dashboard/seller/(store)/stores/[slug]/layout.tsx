import {currentUser} from "@clerk/nextjs/server";
import {db} from "@/db";
import {notFound, redirect} from "next/navigation";

interface SellerStoreLayoutProps {
    children: React.ReactNode;
    params: Promise<{ slug: string }>;
}

export default async function SellerStoreLayout({children, params}: SellerStoreLayoutProps) {
    const user = await currentUser()
    const {slug} = await params

    if (!user?.id) {
        redirect("/")
    }

    const userStores = await db.query.stores.findMany({
        where: (store, {eq}) => eq(store.ownerId, user.id)
    })

    if (userStores.length === 0) {
        redirect("/dashboard/seller/stores/new")
    }

    // Check if the slug parameter matches one of the user's stores...
    const store = userStores.find(store => store.slug === slug)

    if (!store) {
        notFound()
    }


    return (
        <>
            {children}
        </>
    )
}