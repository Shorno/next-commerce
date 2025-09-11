"use client"
import * as React from "react"
import {
    type LucideIcon,
} from "lucide-react"

import {NavUser} from "@/components/sidebar/nav-user"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useUser} from "@clerk/nextjs";
import UserNavSkeleton from "@/components/sidebar/user-nav-skeleton";
import {DashboardIcon, CartIcon, CouponIcon} from "@/components/icons";
import SearchInput from "@/components/SearchInput";
import Products from "@/components/icons/Products";
import InventoryIcon from "@/components/icons/InventoryIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import {SellerNav} from "@/components/dashboard/seller/seller-nav";
import {Store} from "@/db/schema";
import {StoreSwitcher} from "@/components/dashboard/seller/store-switcher";

export interface SellerNavItem {
    title: string
    url: string
    postUrL: string
    icon: LucideIcon | React.ComponentType
}

const navMain: SellerNavItem[] = [
    {
        title: "Dashboard",
        url: "/dashboard/",
        postUrL: "",
        icon: DashboardIcon,
    },
    {
        title: "Products",
        url: "/dashboard/seller/products",
        postUrL: "products",
        icon: Products,
    },
    {
        title: "Orders",
        url: "/dashboard/seller/orders",
        postUrL: "orders",
        icon: CartIcon,
    },
    {
        title: "Inventory",
        url: "/dashboard/seller/inventory",
        postUrL: "inventory",
        icon: InventoryIcon,
    },
    {
        title: "Coupons",
        url: "/dashboard/seller/coupons",
        postUrL: "coupons",
        icon: CouponIcon,
    },
    {
        title: "Settings",
        url: "/dashboard/seller/settings",
        postUrL: "settings",
        icon: SettingsIcon,
    },

]

interface SellerSidebarProps extends React.ComponentProps<typeof Sidebar> {
    stores: Store[]
}

export function SellerSidebar({stores, ...props}: SellerSidebarProps) {
    const {isLoaded, user} = useUser()

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <StoreSwitcher stores={stores}/>
            </SidebarHeader>
            <SidebarContent>
                <SearchInput/>
                <SellerNav items={navMain}/>
            </SidebarContent>
            <SidebarFooter>
                {isLoaded ? <NavUser user={user}/> : <UserNavSkeleton/>}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
