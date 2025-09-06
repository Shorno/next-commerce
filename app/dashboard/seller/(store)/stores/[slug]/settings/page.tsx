import {db} from "@/db";
import EditStoreForm from "@/app/dashboard/seller/(store)/stores/[slug]/settings/_components/edit-store-form";

interface StoreSettingsPageProps {
    params: Promise<{ slug: string }>
}

export default async function SellerSettingsPage({params}: StoreSettingsPageProps) {
    const {slug} = await params
    const store = await db.query.stores.findFirst({
        where: (stores, {eq}) => eq(stores.slug, slug)
    })

    return (
        <>
            <EditStoreForm mode={"edit"} store={store}/>
        </>
    )
}
