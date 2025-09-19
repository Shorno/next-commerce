import {Card, CardContent} from "@/components/ui/card";
import {NewspaperIcon, SendIcon} from "lucide-react";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";

export default function Newsletter() {
    return (
        <Card className={"rounded-none bg-slate-500 text-white dark:bg-slate-800 border-none"}>
            <CardContent className={"flex flex-col md:flex md:flex-row  gap-4 justify-between container mx-auto"}>
               <div>
                   <div className={"flex gap-2"}>
                       <p className={"flex gap-2"}><NewspaperIcon/> <span className={"text-lg font-semibold"}>Subscribe to our Newsletter</span></p>
                   </div>
                   <p className={"text-xs"}>...and get upto 10$ coupon first purchase</p>
               </div>
                <div className="relative flex w-full md:w-80 lg:w-96 gap-2">
                    <div className="relative flex-1">
                        <SendIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 " />
                        <Input
                            placeholder="Enter your email..."
                            className="rounded-2xl h-11 pl-10 text-white placeholder:text-white"
                        />
                        <Button variant={"amazon"} className={"rounded-2xl absolute top-1/2 transform -translate-y-1/2 right-1"}>
                            Subscribe
                        </Button>
                    </div>

                </div>

            </CardContent>
        </Card>
    )
}