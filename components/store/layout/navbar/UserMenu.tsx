"use client"

import type React from "react"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { useClerk, useUser } from "@clerk/nextjs"
import { HeartIcon, ListIcon, MessageCircle, User, LogOut } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface UserLink {
    label: string
    href: string
}

interface PublicLink extends UserLink {
    icon: React.ReactNode
}

const userLinks: UserLink[] = [
    { label: "Settings", href: "/settings" },
    { label: "Become a Seller", href: "/seller" },
    { label: "Help Center", href: "/help" },
    { label: "Return and Refund Policy", href: "/returns" },
    { label: "Discount and Offers", href: "/offers" },
    { label: "Report a Problem", href: "/report" },
]

const publicLinks: PublicLink[] = [
    { label: "My Orders", href: "/orders", icon: <ListIcon className="h-4 w-4" /> },
    { label: "Messages", href: "/messages", icon: <MessageCircle className="h-4 w-4" /> },
    { label: "Wishlist", href: "/wishlist", icon: <HeartIcon className="h-4 w-4" /> },
]

interface UserMenuProps {
    trigger: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export default function UserMenu({ trigger, open, onOpenChange, onMouseEnter, onMouseLeave }: UserMenuProps) {
    const { isSignedIn, user } = useUser()
    const { signOut } = useClerk()

    const handleClosePopover = () => {
        onOpenChange?.(false)
    }

    const handleSignOut = async () => {
        handleClosePopover()
        await signOut()
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>{trigger}</PopoverTrigger>
            <PopoverContent
                className="w-80 max-w-[calc(100vw-2rem)] shadow-lg rounded-xl border bg-background p-4 z-50"
                align="center"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <div className="space-y-4">
                    {isSignedIn ? (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="flex flex-col items-center space-y-2">
                                <Avatar className="h-16 w-16">
                                    <AvatarImage
                                        src={user?.imageUrl || "/placeholder.svg"}
                                        alt={`${user?.firstName || "User"}'s profile picture`}
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        <User className="h-6 w-6" />
                                    </AvatarFallback>
                                </Avatar>
                                {user?.firstName && (
                                    <div className="text-center">
                                        <p className="font-medium text-sm">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                                    </div>
                                )}
                            </div>
                            <Button
                                onClick={handleSignOut}
                                variant="outline"
                                size="sm"
                                className="w-full hover:bg-destructive hover:text-destructive-foreground transition-colors bg-transparent"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Sign Out
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            <Button size="default" className="w-full font-medium" asChild>
                                <Link href="/sign-in" onClick={handleClosePopover}>
                                    Sign In
                                </Link>
                            </Button>
                            <Button variant="outline" size="default" className="w-full bg-transparent" asChild>
                                <Link href="/sign-up" onClick={handleClosePopover}>
                                    Create Account
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Quick Actions</h3>
                    <div className="grid grid-cols-3 gap-4">
                        {publicLinks.map((link) => (
                            <Link
                                key={link.label}
                                href={link.href}
                                onClick={handleClosePopover}
                                className={cn(
                                    "flex flex-col items-center space-y-2 p-3 rounded-lg",
                                    "hover:bg-muted transition-colors duration-200",
                                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                    "active:bg-muted/80 touch-manipulation",
                                )}
                                aria-label={link.label}
                            >
                                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/10 text-primary">
                                    {link.icon}
                                </div>
                                <span className="text-xs font-medium text-center leading-tight">{link.label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                <Separator className="my-4" />
                <div className="space-y-3">
                    <h3 className="text-sm font-medium text-muted-foreground">Account & Support</h3>
                    <nav>
                        <ul className="space-y-1">
                            {userLinks.map((link) => (
                                <li key={link.label}>
                                    <Link
                                        href={link.href}
                                        onClick={handleClosePopover}
                                        className={cn(
                                            "block px-3 py-2 text-sm rounded-md",
                                            "hover:bg-muted transition-colors duration-200",
                                            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                                            "active:bg-muted/80 touch-manipulation",
                                        )}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </PopoverContent>
        </Popover>
    )
}
