import {getStoreShippingRates} from "@/actions/store/storeShippingDetails";
import ShippingRateTable from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateTable";
import {
    shippingRateColumns
} from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateColumns";

interface ShippingRateCountryListProps {
    slug: string
}


export default async function ShippingRateCountryList({slug} : ShippingRateCountryListProps) {
    const shippingRates = await getStoreShippingRates(slug);

    return (
        <ShippingRateTable data={shippingRates} columns={shippingRateColumns}/>
    )
}