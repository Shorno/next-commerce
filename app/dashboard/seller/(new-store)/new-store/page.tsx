import StoreRegMultiStepForm from "@/app/dashboard/seller/(new-store)/new-store/_components/store-reg-multi-step-form";
import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/db";
import getPendingStore from "@/actions/store/getPendingStore";
import PendingStoreApplication from "@/app/dashboard/seller/(new-store)/new-store/_components/PendingStoreApplication";

export default async function NewStorePage() {
    const user = await currentUser();

    const pendingStore = await getPendingStore();
    console.log(pendingStore)

    if (!user) {
        redirect("/")
    }

    const store = await db.query.stores.findFirst({
        where: (store, {eq}) => eq(store.ownerId, user.id)
    })

    if (store?.status === "ACTIVE") {
        redirect(`/dashboard/seller/stores/${store.slug}`)
    }


    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {pendingStore ? <PendingStoreApplication data={store}/> : <StoreRegMultiStepForm/>}
        </div>
    );
}
