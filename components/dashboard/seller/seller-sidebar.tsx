"use client"

import * as React from "react"
import {
    AudioWaveform,
    Command,
    GalleryVerticalEnd, type LucideIcon,
} from "lucide-react"

import {AdminNav} from "@/components/sidebar/admin-nav"
import {NavUser} from "@/components/sidebar/nav-user"
import {TeamSwitcher} from "@/components/sidebar/team-switcher"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
} from "@/components/ui/sidebar"
import {useUser} from "@clerk/nextjs";
import UserNavSkeleton from "@/components/sidebar/user-nav-skeleton";
import {DashboardIcon, CartIcon, StoreIcon, SubCategoryIcon, CategoryIcon, CouponIcon} from "@/components/icons";
import SearchInput from "@/components/SearchInput";
import Products from "@/components/icons/Products";
import InventoryIcon from "@/components/icons/InventoryIcon";
import SettingsIcon from "@/components/icons/SettingsIcon";
import {SellerNav} from "@/components/dashboard/seller/seller-nav";


const data = {
    user: {
        name: "shadcn",
        email: "m@example.com",
        avatar: "/avatars/shadcn.jpg",
    },
    teams: [
        {
            name: "Acme Inc",
            logo: GalleryVerticalEnd,
            plan: "Enterprise",
        },
        {
            name: "Acme Corp.",
            logo: AudioWaveform,
            plan: "Startup",
        },
        {
            name: "Evil Corp.",
            logo: Command,
            plan: "Free",
        },
    ],

}

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

export function SellerSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {isLoaded, user} = useUser()
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
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
