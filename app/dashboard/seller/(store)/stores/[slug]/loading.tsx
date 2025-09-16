import {Loader} from "lucide-react";

export default function Loading(){
    return (
        <div className={"flex w-full justify-center items-center min-h-[calc(100vh-64px)]"}>
            <Loader className={"animate-spin size-12 md:size-16"}/>
        </div>
    )
}