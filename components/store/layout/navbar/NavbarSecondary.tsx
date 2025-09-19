import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Menu, ArrowRight } from "lucide-react";
import { getAllCategories } from "@/actions/admin/categoris";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";

export default async function NavbarSecondary() {
    const categories = await getAllCategories();

    return (
        <div className="bg-white/95 backdrop-blur-sm   py-1 shadow-xs dark:bg-slate-800/80 ">
            <div className="mx-auto px-2">
                <Sheet modal={false}>
                    <SheetTrigger asChild>
                        <Button
                            variant="ghost"
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800 transition-colors"
                        >
                            <Menu className="h-4 w-4" />
                            <span className="font-medium">Browse Categories</span>
                        </Button>
                    </SheetTrigger>

                    <SheetContent
                        side="left"
                        className="w-80 sm:w-96 p-0 overflow-y-auto"
                    >
                        <SheetHeader className="p-6 pb-4 border-b border-gray-200 dark:border-gray-800">
                            <SheetTitle className="text-xl font-semibold text-left">
                                Shop by Category
                            </SheetTitle>
                            <SheetDescription className="text-sm text-gray-600 dark:text-gray-400 text-left">
                                Discover our complete range of products
                            </SheetDescription>
                        </SheetHeader>

                        <div className="p-4">
                            <div className="grid gap-2">
                                {categories.map((category) => (
                                    <Link
                                        key={category.id}
                                        href={category.slug}
                                        className="group"
                                    >
                                        <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                            <div className="relative flex-shrink-0">
                                                <Image
                                                    src={category.image}
                                                    alt={category.name}
                                                    width={48}
                                                    height={48}
                                                    className="rounded-md object-cover"
                                                />
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                    {category.name}
                                                </h3>
                                            </div>

                                            <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Optional: Add a "View All Categories" footer */}
                        <div className="p-4 border-t border-gray-200 dark:border-gray-800 mt-auto">
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/categories">
                                    View All Categories
                                </Link>
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    );
}
