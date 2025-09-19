import {NextResponse} from "next/server";
import {getUserCountry} from "@/actions/getUserCountry";

export async function createResponseWithCountry() {
    const response = NextResponse.next();
    try {
        const userCountry = await getUserCountry();
        response.cookies.set("user_country", JSON.stringify(userCountry), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    } catch (error) {
        console.error("Failed to detect user country:", error);
    }
    return response;
}