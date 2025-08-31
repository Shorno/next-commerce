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

export interface NavItem {
    title: string
    url: string
    icon: LucideIcon | React.ComponentType
    isActive?: boolean
}

const navMain: NavItem[] = [
    {
        title: "Admin",
        url: "/dashboard/admin",
        icon: DashboardIcon,
        isActive: true,
    },
    {
        title: "Stores",
        url: "/dashboard/admin/stores",
        icon: StoreIcon,
    },
    {
        title: "Orders",
        url: "/dashboard/admin/orders",
        icon: CartIcon,
    },
    {
        title: "Categories",
        url: "/dashboard/admin/categories",
        icon: CategoryIcon,
    },
    {
        title: "Sub Categories",
        url: "/dashboard/admin/sub-categories",
        icon: SubCategoryIcon,
    },
    {
        title: "Coupons",
        url: "/dashboard/admin/coupons",
        icon: CouponIcon,
    },
]

export function AdminSidebar({...props}: React.ComponentProps<typeof Sidebar>) {
    const {isLoaded, user} = useUser()
    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader>
                <TeamSwitcher teams={data.teams}/>
            </SidebarHeader>
            <SidebarContent>
                <SearchInput/>
                <AdminNav items={navMain}/>
            </SidebarContent>
            <SidebarFooter>
                {isLoaded ? <NavUser user={user}/> : <UserNavSkeleton/>}
            </SidebarFooter>
            <SidebarRail/>
        </Sidebar>
    )
}
