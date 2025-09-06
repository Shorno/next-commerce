"use client"

import * as React from "react"
import {ChevronsUpDown, Plus} from "lucide-react"
import {useRouter} from "next/navigation"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from "@/components/ui/sidebar"
import {usePathname} from "next/navigation";
import {Store} from "@/db/schema";
import Image from "next/image";

export function StoreSwitcher({
                                  stores,
                              }: {
    stores: Store[]
}) {
    const {isMobile} = useSidebar()
    const router = useRouter()
    const pathname = usePathname()

    // Extract the current store slug from URL
    // Assuming URL structure: /dashboard/seller/stores/{storeSlug}/...
    const pathSegments = pathname?.split("/") || []
    const activeStoreSlug = pathSegments[4] // Adjust index based on your URL structure

    // Find active store, fallback to first store
    const activeStore = stores.find((store) => store.slug === activeStoreSlug) || stores[0]

    // Handle store switching
    const handleStoreSwitch = (store: Store) => {
        if (!pathname) return

        // Replace the store slug in the current path
        const newPathSegments = [...pathSegments]
        newPathSegments[4] = store.slug // Replace store slug at index 4
        const newPath = newPathSegments.join("/")

        router.replace(newPath)
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <div className="flex items-center justify-center rounded-md border ">
                                {activeStore.logo ? (
                                    <Image
                                        src={activeStore.logo}
                                        alt={`${activeStore.name} logo`}
                                        width={50}
                                        height={50}
                                        className="h-10 w-10 object-cover rounded-sm"
                                    />
                                ) : (
                                    <div className="h-10 w-10 bg-muted rounded-sm flex items-center justify-center">
                                        <span className="text-xs font-medium">
                                            {activeStore?.name?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                                <span className="truncate font-medium">
                                    {activeStore?.name || "Select Store"}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
                                    {stores.length} store{stores.length !== 1 ? 's' : ''} available
                                </span>
                            </div>
                            <ChevronsUpDown className="ml-auto size-4"/>
                        </SidebarMenuButton>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                        align="start"
                        side={isMobile ? "bottom" : "right"}
                        sideOffset={4}
                    >
                        <DropdownMenuLabel className="text-muted-foreground text-xs">
                            Your Stores
                        </DropdownMenuLabel>
                        {stores.map((store) => (
                            <DropdownMenuItem
                                key={store.id || store.slug}
                                onClick={() => handleStoreSwitch(store)}
                                className="gap-2 p-2 cursor-pointer"
                                disabled={store.slug === activeStoreSlug}
                            >
                                <div className="flex size-6 items-center justify-center rounded-md border">
                                    {store.logo ? (
                                        <Image
                                            src={store.logo}
                                            alt={`${store.name} logo`}
                                            width={24}
                                            height={24}
                                            className="object-cover h-4 w-4 rounded-sm"
                                        />
                                    ) : (
                                        <span className="text-xs font-medium">
                                            {store.name?.[0]?.toUpperCase()}
                                        </span>
                                    )}
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="font-medium">{store.name}</span>
                                    {store.slug === activeStoreSlug && (
                                        <span className="text-xs text-muted-foreground">Active</span>
                                    )}
                                </div>
                            </DropdownMenuItem>
                        ))}
                        <DropdownMenuSeparator/>
                        <DropdownMenuItem
                            className="gap-2 p-2 cursor-pointer"
                            onClick={() => {
                                router.push('/dashboard/seller/new-store')
                            }}
                        >
                            <div className="flex size-6 items-center justify-center rounded-md border bg-transparent">
                                <Plus className="size-4"/>
                            </div>
                            <div className="text-muted-foreground font-medium">Add Store</div>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    )
}