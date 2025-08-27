import {currentUser} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {UserRole} from "@/db/schema";

export default async function DashboardPage() {
    const user = await currentUser();
    const role  = user?.privateMetadata?.role as UserRole;

    const redirectMap: Record<string, string> = {
        ADMIN: "/dashboard/admin",
        SELLER: "/dashboard/seller",
        USER: "/",
    };

    redirect(redirectMap[role] ?? "/");

}