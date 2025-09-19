import {CountryDropdown} from "@/components/country-dropdown";

export default function CountryCurrencySwitcher() {
    return (
        <div className={"w-72 flex flex-col gap-2"}>
            <p className={"text-lg font-semibold"}>Ship To</p>
            <CountryDropdown/>
        </div>
    )
}