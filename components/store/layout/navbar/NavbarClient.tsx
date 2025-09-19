"use client"
import { ArrowDown, ShoppingCartIcon, User, UserIcon } from "lucide-react"
import {useState, useRef, useCallback} from "react"
import { useUser } from "@clerk/nextjs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import SearchBar from "@/components/store/layout/navbar/SearchBar"
import type { Country } from "@/actions/getUserCountry"
import UserPreference from "@/components/store/layout/navbar/UserPreference";
import UserMenu from "@/components/store/layout/navbar/UserMenu";
import {CircleFlag} from "react-circle-flags";
import usePopoverWithHover from "@/hooks/use-popover-hover";

interface NavbarClientProps {
    country: Country
}

export default function NavbarClient({ country }: NavbarClientProps) {
    const { isSignedIn, isLoaded, user } = useUser()
    const [isFocused, setIsFocused] = useState(false)
    const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    const userMenu = usePopoverWithHover(false, 150)
    const userPreference = usePopoverWithHover(false, 150)

    const handleSearchFocus = () => {
        setIsFocused(true)
    }

    const handleSearchBlur = () => {
        setIsFocused(false)
    }

    // Focus state management - separate from popover logic
    const handleFocusEnter = useCallback(() => {
        if (focusTimeoutRef.current) {
            clearTimeout(focusTimeoutRef.current)
            focusTimeoutRef.current = null
        }
        setIsFocused(true)
    }, [])

    const handleFocusLeave = useCallback(() => {
        focusTimeoutRef.current = setTimeout(() => {
            setIsFocused(false)
        }, 150)
    }, [])

    // Enhanced handlers that combine popover and focus logic
    const createEnhancedHandlers = useCallback((baseHandlers: ReturnType<typeof usePopoverWithHover>['handlers']) => ({
        onMouseEnter: () => {
            baseHandlers.onMouseEnter()
            handleFocusEnter()
        },
        onMouseLeave: () => {
            baseHandlers.onMouseLeave()
            handleFocusLeave()
        },
        onClick: baseHandlers.onClick,
        onOpenChange: baseHandlers.onOpenChange,
        onPopoverMouseEnter: () => {
            baseHandlers.onPopoverMouseEnter()
            handleFocusEnter()
        },
        onPopoverMouseLeave: () => {
            baseHandlers.onPopoverMouseLeave()
            handleFocusLeave()
        }
    }), [handleFocusEnter, handleFocusLeave])

    const enhancedUserMenuHandlers = createEnhancedHandlers(userMenu.handlers)
    const enhancedUserPreferenceHandlers = createEnhancedHandlers(userPreference.handlers)

    return (
        <>
            {isFocused && <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setIsFocused(false)} />}

            <nav className="relative z-50  bg-gradient-to-r from-slate-500 to-slate-600 dark:from-slate-800  dark:to-slate-800">
                <div className="w-full">
                    {/* Main navbar row */}
                    <div className="flex items-center justify-between w-full gap-4 px-4 h-16">
                        {/* Left section - Logo and location (desktop only) */}
                        <div className="flex items-center gap-4 md:gap-8 flex-shrink-0">
                            <div className="flex flex-col justify-center items-center whitespace-nowrap">
                                <span className="text-white font-semibold text-lg">Next Commerce</span>
                            </div>
                        </div>

                        {/* Center section - Search bar (desktop only) */}
                        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
                            <SearchBar variant="desktop" onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
                        </div>

                        {/* User Preference */}
                        <UserPreference
                            country={country}
                            open={userPreference.isOpen}
                            onOpenChange={enhancedUserPreferenceHandlers.onOpenChange}
                            onMouseEnter={enhancedUserPreferenceHandlers.onPopoverMouseEnter}
                            onMouseLeave={enhancedUserPreferenceHandlers.onPopoverMouseLeave}
                            trigger={
                                <div
                                    className="hidden lg:flex items-center gap-2 justify-center text-sm cursor-pointer hover:opacity-80 transition-opacity duration-200 text-white"
                                    onMouseEnter={enhancedUserPreferenceHandlers.onMouseEnter}
                                    onMouseLeave={enhancedUserPreferenceHandlers.onMouseLeave}
                                    onClick={enhancedUserPreferenceHandlers.onClick}
                                >
                                    <div className="inline-flex items-center justify-center w-6 h-6 shrink-0 overflow-hidden rounded-full">
                                        <CircleFlag countryCode={country.country_code.toLowerCase()} />
                                    </div>
                                    <div className="flex flex-col">
                                        <p>{country.country}</p>
                                        <div className="flex items-center">
                                            BDT <ArrowDown size={16} />
                                        </div>
                                    </div>
                                </div>
                            }
                        />

                        {/* Right section - User menu and cart */}
                        <div className="flex gap-4 sm:gap-8 items-center flex-shrink-0">
                            {!isLoaded ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-8 w-8 rounded-full bg-white/20 animate-pulse" />
                                </div>
                            ) : !isSignedIn ? (
                                <UserMenu
                                    open={userMenu.isOpen}
                                    onOpenChange={enhancedUserMenuHandlers.onOpenChange}
                                    onMouseEnter={enhancedUserMenuHandlers.onPopoverMouseEnter}
                                    onMouseLeave={enhancedUserMenuHandlers.onPopoverMouseLeave}
                                    trigger={
                                        <div
                                            className="flex justify-center items-center gap-2 cursor-pointer text-white hover:text-gray-200 transition-colors duration-200"
                                            onMouseEnter={enhancedUserMenuHandlers.onMouseEnter}
                                            onMouseLeave={enhancedUserMenuHandlers.onMouseLeave}
                                            onClick={enhancedUserMenuHandlers.onClick}
                                        >
                                            <UserIcon className="text-current" />
                                            <div className="text-current text-start hidden sm:block">
                                                <p className="text-sm text-gray-200">Welcome</p>
                                                <p className="text-sm hidden sm:flex gap-1 items-center font-semibold">
                                                    Sign in / Register <ArrowDown size={16} />
                                                </p>
                                            </div>
                                        </div>
                                    }
                                />
                            ) : (
                                <UserMenu
                                    open={userMenu.isOpen}
                                    onOpenChange={enhancedUserMenuHandlers.onOpenChange}
                                    onMouseEnter={enhancedUserMenuHandlers.onPopoverMouseEnter}
                                    onMouseLeave={enhancedUserMenuHandlers.onPopoverMouseLeave}
                                    trigger={
                                        <div
                                            className="cursor-pointer hover:opacity-80 transition-opacity duration-200"
                                            onMouseEnter={enhancedUserMenuHandlers.onMouseEnter}
                                            onMouseLeave={enhancedUserMenuHandlers.onMouseLeave}
                                            onClick={enhancedUserMenuHandlers.onClick}
                                        >
                                            <Avatar className="h-7 w-7 ring-2 ring-white/30">
                                                <AvatarImage
                                                    src={user?.imageUrl || "/placeholder.svg"}
                                                    alt={`${user?.firstName || "User"}'s profile picture`}
                                                />
                                                <AvatarFallback className="bg-white/20 text-white">
                                                    <User className="h-5 w-5" />
                                                </AvatarFallback>
                                            </Avatar>
                                        </div>
                                    }
                                />
                            )}

                            <div className="text-white hover:text-gray-200 flex justify-center items-center gap-2 cursor-pointer transition-colors duration-200">
                                <ShoppingCartIcon className="size-6" />
                                <span className="text-sm font-semibold">Cart</span>
                            </div>
                        </div>
                    </div>

                    {/* Mobile search bar - separate row */}
                    <div className="px-4 pb-4 md:hidden">
                        <SearchBar variant="mobile" onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
                    </div>
                </div>
            </nav>
        </>
    )
}