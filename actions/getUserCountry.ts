"use server"

export interface Country  {
    country_code: string,
    country: string,
    continent_code: string,
    continent: string
}


const DEFAULT_COUNTRY: Country  = {
    country: "Bangladesh",
    country_code: "BD",
    continent: "Asia",
    continent_code: "AS"
}

const IpInfoURL = "https://api.ipinfo.io/lite/me"

export async function getUserCountry(): Promise<Country> {
    let userCountry = DEFAULT_COUNTRY;
    try {
        const response = await fetch(`${IpInfoURL}?token=${process.env.NEXT_PUBLIC_IPINFO_API_KEY}`);
        if (response.ok) {
            const data = await response.json()
            return {
                country: data.country,
                country_code: data.country_code,
                continent: data.continent,
                continent_code: data.continent_code
            }
        }
        return userCountry;
    } catch (error) {
        console.error("Error fetching user country:", error);
        return userCountry
    }

}