import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import {ThemeProvider} from "next-themes";
import {ClerkProvider} from "@clerk/nextjs";
import {dark} from "@clerk/themes";
import {Toaster} from "sonner";

const interFont = Inter({
    subsets: ["latin"],
    fallback: ["system-ui", "arial"],
    display: "swap",
    weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
    title: "Next Commerce",
    description: "A modern e-commerce app built with Next.js and TypeScript",
};

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <ClerkProvider
            appearance={{
                baseTheme: dark
            }}
        >
            <html lang="en" suppressHydrationWarning={true}>
            <body
                className={`${interFont.className} antialiased`}
            >
            <ThemeProvider
                attribute={"class"}
                defaultTheme={"system"}
                enableSystem
                disableTransitionOnChange
                enableColorScheme
            >
                {children}
                <Toaster position={"top-right"} richColors={true} icons={
                    {
                        success: "✅",
                        error: "❌",
                        loading: "⏳",
                    }
                }/>
            </ThemeProvider>
            </body>
            </html>
        </ClerkProvider>
    );
}
