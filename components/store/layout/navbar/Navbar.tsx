import NavbarClient from "@/components/store/layout/navbar/NavbarClient";
import {cookies} from "next/headers";
import {Country} from "@/actions/getUserCountry";


const DEFAULT_COUNTRY: Country  = {
    country: "Bangladesh",
    country_code: "BD",
}

export default async function Navbar() {
    const cookieStore = await cookies();
    const countryCookie  = cookieStore.get("user_country")?.value
    const userCountry : Country = countryCookie? JSON.parse(countryCookie) : DEFAULT_COUNTRY

    return <NavbarClient country={userCountry}/>
}