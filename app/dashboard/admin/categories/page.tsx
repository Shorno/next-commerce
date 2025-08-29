import {getAllCategories} from "@/actions/admin/categoris";
import {CategoryTable} from "@/app/dashboard/admin/categories/_components/category-table";
import {categoryColumns} from "@/app/dashboard/admin/categories/_components/columns";
import {Suspense} from "react";
import {CategoryTableSkeleton} from "@/app/dashboard/admin/categories/_components/category-table-skeletion";

export default async function AdminCategoriesPage() {
    const categories = await getAllCategories()
    return (
        <>
            <Suspense fallback={<CategoryTableSkeleton/>}>
                <CategoryTable data={categories} columns={categoryColumns}/>
            </Suspense>
        </>
    )
}