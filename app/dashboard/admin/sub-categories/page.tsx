import {getAllSubcategories} from "@/actions/admin/subcategories";
import {SubcategoryTable} from "@/app/dashboard/admin/sub-categories/_components/subcategory-table";
import {subcategoryColumns} from "@/app/dashboard/admin/sub-categories/_components/subcategory-columns";

export default async function SubCategoriesPage() {
    const subcategories = await getAllSubcategories();

    return (
        <>
            <SubcategoryTable data={subcategories} columns={subcategoryColumns}/>
        </>
    )
}

