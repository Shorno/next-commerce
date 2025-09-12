'use client'
import {QueryClientProvider} from '@tanstack/react-query'
import type * as React from 'react'
import {getQueryClient} from "@/get-query-client";
import {ThemeProvider} from "next-themes";
import {Toaster} from "sonner";

export default function Providers({children}: { children: React.ReactNode }) {
    const queryClient = getQueryClient()

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider
                attribute={"class"}
                defaultTheme={"system"}
                enableSystem
                disableTransitionOnChange
                enableColorScheme
            >
                {children}
                <Toaster position={"top-right"} richColors={true}/>
            </ThemeProvider>

        </QueryClientProvider>
    )
}