"use client"
import type { Country } from "@/actions/getUserCountry"
import type React from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import CountryCurrencySwitcher from "./CountryCurrencySwitcher"

interface UserPreferenceProps {
    country: Country
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
    trigger: React.ReactNode
}

export default function UserPreference({
                                           country,
                                           open,
                                           onOpenChange,
                                           onMouseEnter,
                                           onMouseLeave,
                                           trigger,
                                       }: UserPreferenceProps) {

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
                <CountryCurrencySwitcher country={country}/>
            </PopoverContent>
        </Popover>
    )
}
