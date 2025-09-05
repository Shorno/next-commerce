import {redirect} from "next/navigation";
import getActiveStore from "@/actions/store/getActiveStore";

export default async function SellerDashboardPage() {
    const activeStore = await getActiveStore();

    if (!activeStore) {
        redirect("/dashboard/seller/new-store")
    }

    redirect(`/dashboard/seller/stores/${activeStore.slug}`)
}