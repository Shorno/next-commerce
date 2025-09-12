import {dehydrate, HydrationBoundary} from "@tanstack/react-query";
import ProductForm from "@/app/dashboard/seller/(store)/stores/[slug]/_components/product-form";
import {getQueryClient} from "@/get-query-client";
import {categoryOptions} from "@/data/product";
import {db} from "@/db";

interface NewProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function NewProductPage({params}: NewProductPageProps){
    const {slug} = await params
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(categoryOptions)

    const activeStore = await db.query.stores.findFirst({
        where: (store, {eq, and}) => and(
            eq(store.slug, slug),
            eq(store.status, "ACTIVE")
        )
    })

    console.log(slug)

    if (!activeStore) {
        return <div>Store not found</div>
    }
    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductForm activeStoreId={activeStore?.id}/>
            </HydrationBoundary>
        </>
    )
}