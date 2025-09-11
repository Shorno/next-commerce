import {ProductFormData} from "@/zodSchema/product";
import {db} from "@/db";
import {NewProduct, products} from "@/db/schema";
import {revalidatePath} from "next/cache";

interface ProductApiResponse {
    success: boolean;
    message: string;
    status: number
    data: NewProduct | null
}

export default async function createProduct(data: ProductFormData): Promise<ProductApiResponse> {
    try {
        const existingProduct = await db.query.products.findFirst({
            where: (product, {eq}) => eq(product.slug, data.slug)
        })

        if (existingProduct) {
            return {
                success: false,
                message: 'Product with this slug already exists',
                status: 400,
                data: null
            }
        }

        const newProduct = await db.insert(products).values(data).returning();
        revalidatePath(`/dashboard/seller/stores/${newProduct[0].slug}/products`)

        return {
            success: true,
            message: `Product ${data.name} created successfully`,
            status: 201,
            data: newProduct[0]
        }


    } catch (error) {
        console.log(error)

        return {
            success: false,
            message: 'Failed to check existing product',
            status: 500,
            data: null
        }
    }

}