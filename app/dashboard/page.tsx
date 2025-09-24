import {currentUser} from "@clerk/nextjs/server";
import {UserRole} from "@/db/schema";
import {redirect} from "next/navigation";
import getActiveStores from "@/actions/store/getActiveStores";

export default async function DashboardPage() {
    const user = await currentUser();
    const role = user?.privateMetadata?.role as UserRole;
    console.log(user)
    //
    // const redirectMap: Record<string, string> = {
    //     ADMIN: "/dashboard/admin",
    //     SELLER: "/dashboard/seller",
    //     USER: "/",
    // };


    if (role === "USER") {
        redirect("/dashboard")
    } else if (role === "SELLER") {
        const activeStore = await getActiveStores();
        if (activeStore) {
            redirect(`/dashboard/seller/stores/${activeStore.slug}`)
        } else {
            redirect("/dashboard/seller/new-store")
        }
    } else {
        redirect("/dashboard/admin")
    }


}