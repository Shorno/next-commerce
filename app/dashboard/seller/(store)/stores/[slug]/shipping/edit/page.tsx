import {getStoreShippingDetails} from "@/actions/store/storeShippingDetails";
import ShippingDetailsEditForm
    from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/shippingDetailsEditForm";

interface SellerShippingEditProps {
    params: Promise<{ slug: string }>
}

export default async function EditShippingDetailsPage({params} : SellerShippingEditProps) {
    const {slug} = await params
    const shippingDetails = await getStoreShippingDetails(slug)
    console.log(shippingDetails)

    return (
        <>
            <ShippingDetailsEditForm shippingDetails={shippingDetails} slug={slug}/>
        </>
    )
}
