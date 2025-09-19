import {SignOutButton, UserButton} from "@clerk/nextjs";
import type React from "react";
import DayNightSwitch from "@/components/shsfui/switch/day-night-switch";
import CountryCurrencySwitcher from "@/components/store/layout/navbar/CountryCurrencySwitcher";


export default async function Home() {
    return (
        <div>
            home page
            <UserButton/>
            <SignOutButton/>
            <DayNightSwitch/>
            <CountryCurrencySwitcher/>
        </div>
    );
}
