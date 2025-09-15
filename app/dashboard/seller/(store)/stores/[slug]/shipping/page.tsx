import {getStoreShippingRates} from "@/actions/store/storeShippingDetails"
import StoreDefaultShippingDetails
    from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/StoreDefaultShippingDetails";
import {Suspense} from "react";
import ShippingRateTable from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateTable";
import {
    shippingRateColumns
} from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateColumns";
import StoreShippingDetailsSkeleton
    from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingDetailsSkeleton";

interface SellerShippingPageProps {
    params: Promise<{ slug: string }>
}

export default async function SellerShippingPage({params}: SellerShippingPageProps) {
    const {slug} = await params
    const shippingRates = await getStoreShippingRates(slug);

    return (
        <>
            <Suspense fallback={<StoreShippingDetailsSkeleton/>}>
                <StoreDefaultShippingDetails slug={slug}/>
            </Suspense>
            <ShippingRateTable data={shippingRates} columns={shippingRateColumns}/>
        </>
    )
}
