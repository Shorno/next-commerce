"use client"
import {ArrowDown, MapPin, ShoppingCartIcon, User, UserIcon} from "lucide-react"
import {useState, useRef} from "react"
import UserMenu from "@/components/store/layout/navbar/UserMenu"
import {useUser} from "@clerk/nextjs"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import SearchBar from "@/components/store/layout/navbar/SearchBar";
import {useIsMobile} from "@/hooks/use-mobile";
import UserPreference from "@/components/store/layout/navbar/UserPreference";
import {Country} from "@/actions/getUserCountry";

interface NavbarClientProps {
    country: Country
}

export default function NavbarClient({country}: NavbarClientProps) {
    const {isSignedIn, isLoaded, user} = useUser()
    const [isFocused, setIsFocused] = useState(false)
    const [showUserMenu, setShowUserMenu] = useState(false)
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const isMobile = useIsMobile()


    const handleSearchFocus = () => {
        setIsFocused(true)
    }

    const handleSearchBlur = () => {
        setIsFocused(false)
    }

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }

        if (!isMobile && !showUserMenu) {
            setShowUserMenu(true)
        }
        setIsFocused(true)
    }

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setShowUserMenu(false)
            setIsFocused(false)
        }, 150) // 150ms delay
    }

    const handleUserMenuClick = () => {
        setShowUserMenu(!showUserMenu)
    }

    const handlePopoverOpenChange = (open: boolean) => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        setShowUserMenu(open)
    }

    const handlePopoverMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current)
            closeTimeoutRef.current = null
        }
        setIsFocused(true)
    }

    const handlePopoverMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setShowUserMenu(false)
            setIsFocused(false)
        }, 150)
    }

    return (
        <>
            {isFocused && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsFocused(false)}/>}

            <nav
                className="relative z-50 py-1 bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-800 dark:via-gray-900 dark:to-slate-800">
                <div className="w-full">
                    {/* Main navbar row */}
                    <div className="flex items-center justify-between w-full gap-4 px-4 h-16">
                        {/* Left section - Logo and location (desktop only) */}
                        <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                            <div className="flex flex-col justify-center items-center whitespace-nowrap">
                                <span className="text-white font-semibold text-lg">Next Commerce</span>
                            </div>

                            {/* Location - hidden on mobile to save space */}
                            <div className="hidden lg:flex items-end">
                                <MapPin className="text-gray-200 dark:text-gray-300 size-4 mb-1"/>
                                <div>
                                    <p className="text-gray-200 dark:text-gray-300 text-sm">Deliver to</p>
                                    <h1 className="text-white text-sm font-bold">Bangladesh</h1>
                                </div>
                            </div>
                        </div>

                        {/* Center section - Search bar (desktop only) */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <SearchBar
                                variant="desktop"
                                onFocus={handleSearchFocus}
                                onBlur={handleSearchBlur}
                            />
                        </div>
                        <UserPreference country={country}/>

                        {/* Right section - User menu and cart */}
                        <div className="flex gap-4 sm:gap-8 items-center flex-shrink-0">
                            {!isLoaded ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse"/>
                                </div>
                            ) : !isSignedIn ? (
                                <UserMenu
                                    open={showUserMenu}
                                    onOpenChange={handlePopoverOpenChange}
                                    onMouseEnter={handlePopoverMouseEnter}
                                    onMouseLeave={handlePopoverMouseLeave}
                                    trigger={
                                        <div
                                            className="flex justify-center items-center gap-2 cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={handleUserMenuClick}
                                        >
                                            <UserIcon className="text-current"/>
                                            <div className="text-current text-start hidden sm:block">
                                                <p className="text-sm text-gray-200">Welcome</p>
                                                <p className="text-sm hidden sm:flex gap-1 items-center font-semibold">
                                                    Sign in / Register <ArrowDown size={16}/>
                                                </p>
                                            </div>
                                        </div>
                                    }
                                />
                            ) : (
                                <UserMenu
                                    open={showUserMenu}
                                    onOpenChange={handlePopoverOpenChange}
                                    onMouseEnter={handlePopoverMouseEnter}
                                    onMouseLeave={handlePopoverMouseLeave}
                                    trigger={
                                        <div
                                            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                            onMouseEnter={handleMouseEnter}
                                            onMouseLeave={handleMouseLeave}
                                            onClick={handleUserMenuClick}
                                        >
                                            <Avatar className="h-8 w-8 ring-2 ring-white/30">
                                                <AvatarImage
                                                    src={user?.imageUrl || "/placeholder.svg"}
                                                    alt={`${user?.firstName || "User"}'s profile picture`}
                                                />
                                                <AvatarFallback className="bg-white/20 text-white">
                                                    <User className="h-6 w-6"/>
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    }
                                />
                            )}

                            <div
                                className="text-white hover:text-gray-200 flex justify-center items-center gap-2 cursor-pointer transition-colors duration-200">
                                <ShoppingCartIcon className="size-6"/>
                                <span className="text-sm  font-semibold">Cart</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile search bar - separate row */}
                    <div className="px-4 pb-4 md:hidden">
                        <SearchBar
                            variant="mobile"
                            onFocus={handleSearchFocus}
                            onBlur={handleSearchBlur}
                        />
                    </div>
                </div>
            </nav>
        </>
    )
}