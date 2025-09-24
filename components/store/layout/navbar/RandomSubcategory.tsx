import {getRandomSubCategories} from "@/actions/admin/subcategories";
import Link from "next/link";
import React from "react";


export const RandomSubcategorySkeleton = () => {
    return (
        <>
            <li className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></li>
            <li className="h-4 w-2/4 bg-gray-200 rounded animate-pulse mt-2"></li>
            <li className="h-4 w-5/6 bg-gray-200 rounded animate-pulse mt-2"></li>
            <li className="h-4 w-1/2 bg-gray-200 rounded animate-pulse mt-2"></li>
            <li className="h-4 w-3/5 bg-gray-200 rounded animate-pulse mt-2"></li>
        </>
    )
}


export default async function RandomSubcategory() {
    const subcategories = await getRandomSubCategories();

    return (
        <div>
            <h3 className="font-bold mb-2">Find Your Products</h3>
            <ul className="text-muted-foreground space-y-3 text-sm">
                {subcategories.map((subcategory) => (
                    <li
                        key={subcategory.id}
                        className="hover:text-primary font-medium"
                    >
                        <Link href={subcategory.slug}>{subcategory.name}</Link>
                    </li>
                ))}
            </ul>
        </div>
    )
}