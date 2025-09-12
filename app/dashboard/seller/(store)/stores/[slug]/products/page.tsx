import {getQueryClient} from "@/get-query-client";
import {categoryOptions} from "@/data/product";
import {db} from "@/db";
import {Suspense} from "react";
import Link from "next/link";
import {Button} from "@/components/ui/button";

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


    return (
        <>
            <Button asChild>
                <Link href={`/dashboard/seller/stores/${slug}/products/new`}>New Product</Link>
            </Button>
            <Suspense fallback={"loading..."}>
                {
                    storeProducts.map((product) => <div key={product.id}>{product.name}</div>)
                }
            </Suspense>
        </>
    )
}