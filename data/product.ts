import {queryOptions} from "@tanstack/react-query";
import {getAllCategories} from "@/actions/admin/categoris";
import {getSubcategoriesByCategory, getSubcategoryById} from "@/actions/admin/subcategories";

export const categoryOptions = queryOptions({
    queryKey : ["categories"],
    queryFn : getAllCategories,
})


export const subCategoryOptions = (categoryId: number) =>
    queryOptions({
        queryKey: ["subcategories", categoryId],
        queryFn: () => getSubcategoriesByCategory(categoryId),
        enabled: !!categoryId,
    })
