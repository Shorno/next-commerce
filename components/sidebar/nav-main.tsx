"use client"
import { SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar"
import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {NavItem} from "@/components/sidebar/app-sidebar";

export function NavMain({items} : {items: NavItem[]}) {
    const pathname = usePathname()

    return (
        <SidebarGroup>
            <SidebarMenu>
                {items.map((item) => {
                    const isActive = pathname === item.url;
                    const IconComponent = item.icon;

                    return (
                        <SidebarMenuItem key={`${item.url}`}>
                            <SidebarMenuButton
                                asChild
                                isActive={isActive}
                                className="flex items-cente gap-3 px-3 h-12 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground data-[active=true]:bg-accent data-[active=true]:text-accent-foreground"
                            >
                                <Link href={item.url} className="flex items-center gap-3">
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
