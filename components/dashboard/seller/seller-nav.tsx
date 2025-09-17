"use client"
import {SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar} from "@/components/ui/sidebar"
import type React from "react"

import Link from "next/link"
import {usePathname} from "next/navigation"
import {SellerNavItem} from "@/components/dashboard/seller/seller-sidebar";

export function SellerNav({items}: { items: SellerNavItem[] }) {
    const {setOpenMobile} = useSidebar()
    const pathname = usePathname()
    const sellerRootURL = "/dashboard/seller/stores";

    const storeStartURL = pathname.split("/stores/")[1];
    const activeStore = storeStartURL ? storeStartURL.split("/")[0] : null;


    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {

                    const dynamicLink = item.postUrL === ""
                        ? `${sellerRootURL}/${activeStore}`
                        : `${sellerRootURL}/${activeStore}/${item.postUrL}`;

                    const isActive = pathname === dynamicLink;
                    const IconComponent = item.icon;


                    return (
                        <SidebarMenuItem key={`${item.url}`}>
                            <SidebarMenuButton
                                onClick={() => setOpenMobile(false)}
                                asChild
                                isActive={isActive}
                                className="flex items-cente gap-3 px-3 h-12 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                            >
                                <Link href={dynamicLink}
                                      className="flex items-center gap-3">
                                    <span className="items-center justify-center"><IconComponent/></span>
                                    <span>{item.title}</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )
                })}
            </SidebarMenu>
        </SidebarGroup>
    )
}
