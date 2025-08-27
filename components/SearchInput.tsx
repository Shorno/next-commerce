import {Search} from "lucide-react";
import {Input} from "@/components/ui/input";

export default function SearchInput(){
    return (
        <div className="relative flex items-center px-2 my-4">
            <div className="absolute left-4 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
            </div>
            <Input
                type="search"
                placeholder="Search..."
                className="pl-10 pr-4 h-12  w-full border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                aria-label="Search"
            />
        </div>

    )
}