import ProductForm from "@/app/dashboard/seller/(store)/stores/[slug]/_components/product-form";
import {getQueryClient} from "@/get-query-client";
import {categoryOptions} from "@/data/product";
import {HydrationBoundary, dehydrate} from "@tanstack/react-query";
import {db} from "@/db";

interface SellerProductPageProps {
    params: Promise<{ slug: string }>;
}

export default async function SellerProductPage({params}: SellerProductPageProps) {
    const {slug} = await params
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(categoryOptions)

    const activeStore = await db.query.stores.findFirst({
        where: (store, {eq, and}) => and(
            eq(store.slug, slug),
            eq(store.status, "ACTIVE")
        )
    })

    if (!activeStore) {
        return <div>Store not found</div>
    }
    const storeProducts = await db.query.products.findMany({
        where: (product, {eq}) => eq(product.storeId, activeStore.id),
        with: {
            variants: {
                with: {
                    sizes: true,
                    colors: true,
                    images: true,
                    specs: true
                }
            }
        }

    })

    console.log(storeProducts)


    return (
        <>
            <HydrationBoundary state={dehydrate(queryClient)}>
                <ProductForm activeStoreId={activeStore?.id}/>
            </HydrationBoundary>
        </>
    )
}