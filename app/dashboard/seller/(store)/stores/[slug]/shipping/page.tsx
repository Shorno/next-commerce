import {Suspense} from "react";
import StoreDefaultShippingDetails from "./_components/StoreDefaultShippingDetails";
import StoreShippingDetailsSkeleton from "./_components/ShippingDetailsSkeleton";
import ShippingRateCountryList from "./_components/ShippingRateCountryList";
import ShippingRateTableSkeleton from "./_components/ShippingRateTableSkeleton"

interface SellerShippingPageProps {
    params: Promise<{ slug: string }>
}

export default async function SellerShippingPage({params}: SellerShippingPageProps) {
    const {slug} = await params
    return (
        <>
            <Suspense fallback={<StoreShippingDetailsSkeleton/>}>
                <StoreDefaultShippingDetails slug={slug}/>
            </Suspense>
            <Suspense fallback={<ShippingRateTableSkeleton/>}>
                <ShippingRateCountryList slug={slug}/>
            </Suspense>
        </>
    )
}
