import {clerkMiddleware, createRouteMatcher} from '@clerk/nextjs/server'
import {NextResponse} from "next/server";
import {createResponseWithCountry} from "@/utils/createResponseWithCountry";

const isProtectedRoute = createRouteMatcher(['/dashboard(.*)'])


export default clerkMiddleware(async (auth, req) => {
    if (isProtectedRoute(req)) await auth.protect()

    const countryCookie = req.cookies.get("user_country");

    return countryCookie
        ? NextResponse.next()
        : await createResponseWithCountry()

})

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
        // Always run for API routes
        '/(api|trpc)(.*)',
    ],
}