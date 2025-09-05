import {validateStoreAccess} from "@/lib/store-validation";

interface SellerStorePageProps {
    params: Promise<{ slug: string }>;
}

export default async function SellerStorePage({params}: SellerStorePageProps) {
    const {slug} = await params
    const store = await validateStoreAccess(slug);


    return (
        <>
            <h1>Store: {store?.name}</h1>
            <p>Store slug: {store?.slug}</p>
            {/* Your store dashboard content here */}
        </>
    );
}