import DayNightSwitch from "@/components/shsfui/switch/day-night-switch";
import ProductList from "@/components/store/product/ProductList";
import {Suspense} from "react";
export default async function Home() {
    return (
        <div className={"min-h-screen"}>
            <DayNightSwitch/>
            <Suspense fallback={"loading products..."}>
                <ProductList/>
            </Suspense>
        </div>
    );
}
