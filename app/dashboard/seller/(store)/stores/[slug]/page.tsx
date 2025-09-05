import {Suspense} from "react";
import StoreInfo from "@/app/dashboard/seller/(store)/stores/[slug]/_components/store-info";

export default async function SellerStorePage() {

    return (
        <>
            <Suspense fallback={"loading store data..."}>
                <StoreInfo/>
            </Suspense>
        </>
    );
}