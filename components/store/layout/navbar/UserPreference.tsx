"use client"
import {Country} from "@/actions/getUserCountry";
import {ArrowDown} from "lucide-react";
import { CircleFlag} from 'react-circle-flags'
import React from "react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover"
import CountryCurrencySwitcher from "./CountryCurrencySwitcher";

interface UserPreferenceProps {
    country: Country
    open?: boolean
    onOpenChange?: (open: boolean) => void
    onMouseEnter?: () => void
    onMouseLeave?: () => void
}

export default function UserPreference({
                                           country,
                                           open,
                                           onOpenChange,
                                           onMouseEnter,
                                           onMouseLeave
                                       }: UserPreferenceProps) {

    const handleClosePopover = () => {
        onOpenChange?.(false)
    }

    return (
        <Popover open={open} onOpenChange={onOpenChange}>
            <PopoverTrigger asChild>
                <div className={
                    "hidden lg:flex items-center gap-2 justify-center text-sm cursor-pointer hover:opacity-80 transition-opacity duration-200 text-white"
                }>
                    <div className="inline-flex items-center justify-center w-6 h-6 shrink-0 overflow-hidden rounded-full">
                        <CircleFlag countryCode={country.country_code.toLowerCase()}/>
                    </div>
                    <div className={"flex flex-col"}>
                        <p>{country.country}</p>
                        <div className={"flex items-center"}>BDT <ArrowDown size={16}/></div>
                    </div>
                </div>
            </PopoverTrigger>
            <PopoverContent
                className="w-80 max-w-[calc(100vw-2rem)] shadow-lg rounded-xl border bg-background p-4 z-50"
                align="center"
                sideOffset={8}
                onOpenAutoFocus={(e) => e.preventDefault()}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <CountryCurrencySwitcher />
            </PopoverContent>
        </Popover>
    )
}
