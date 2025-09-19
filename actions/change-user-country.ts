"use server"

import {Country} from "@/actions/getUserCountry";
import {cookies} from "next/headers";

export default async function changeUserCountry(data: Country) {
    try {
        const cookiesStore = await cookies();
        cookiesStore.set("user_country", JSON.stringify(data), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
        });
    } catch (error) {
        console.log(error)
    }
}