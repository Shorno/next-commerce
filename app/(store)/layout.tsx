import Navbar from "@/components/store/layout/navbar/Navbar";
import "flag-icons/css/flag-icons.min.css";


export default function StoreLayout({children}: { children: React.ReactNode }) {
    return (
        <>
            <Navbar/>
            {children}
        </>
    )
}