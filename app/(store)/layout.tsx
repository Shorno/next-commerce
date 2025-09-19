import Navbar from "@/components/store/layout/navbar/Navbar";
import "flag-icons/css/flag-icons.min.css";
import NavbarSecondary from "@/components/store/layout/navbar/NavbarSecondary";
import Footer from "@/components/store/layout/navbar/Footer";


export default function StoreLayout({children}: { children: React.ReactNode }) {
    return (
        <div className={"flex flex-col min-h-screen"}>
            <div>
                <Navbar/>
                <NavbarSecondary/>
            </div>
            <div className={"flex-1"}>
                {children}
            </div>
            <Footer/>
        </div>
    )
}