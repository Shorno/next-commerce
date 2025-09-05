import StoreRegMultiStepForm from "@/app/dashboard/seller/(new-store)/new-store/_components/store-reg-multi-step-form";
import getPendingStore from "@/actions/store/getPendingStore";
import PendingStoreApplication from "@/app/dashboard/seller/(new-store)/new-store/_components/PendingStoreApplication";

export default async function NewStorePage() {

    const pendingStore = await getPendingStore();

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            {pendingStore ? <PendingStoreApplication data={pendingStore}/> : <StoreRegMultiStepForm/>}
        </div>
    );
}
