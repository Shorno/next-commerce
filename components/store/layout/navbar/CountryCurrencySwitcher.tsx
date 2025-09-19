import {CountryDropdown} from "@/components/country-dropdown";
import {Country} from "@/actions/getUserCountry";

export default function CountryCurrencySwitcher({country} : {country: Country}) {
    return (
        <div className={"w-72 flex flex-col gap-2"}>
            <p className={"text-lg font-semibold"}>Ship To</p>
            <CountryDropdown defaultCountry={country}/>
        </div>
    )
}