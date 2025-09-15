"use server"
import {countries} from "@/db/schema/countries";
import {db} from "@/db";
import countyData from "@/data/seed/CountryCodes.json"

export async function seedCountries() {
    try {
        const result = await db.insert(countries).values(countyData)
        console.log(result)
    } catch (error) {
        console.error(error)
    }
}
