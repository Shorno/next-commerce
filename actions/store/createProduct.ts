"use server"
import {ProductFormData} from "@/zodSchema/product";
import {db} from "@/db";
import {
    NewProduct,
    products,
    variants,
    sizes,
    colors,
    productVariantImages,
    specs
} from "@/db/schema";
import {revalidatePath} from "next/cache";

interface ProductApiResponse {
    success: boolean;
    message: string;
    status: number
    data: NewProduct | null
}

export default async function createProduct(data: ProductFormData): Promise<ProductApiResponse> {
    console.log(data)
    try {
        // Check if product with slug already exists
        const existingProduct = await db.query.products.findFirst({
            where: (product, {eq}) => eq(product.slug, data.slug)
        });

        if (existingProduct) {
            return {
                success: false,
                message: 'Product with this slug already exists',
                status: 400,
                data: null
            }
        }

        // Start a transaction to ensure data consistency
        const result = await db.transaction(async (tx) => {
            // 1. Extract product data (excluding variants)
            const {variants: variantsData, ...productData} = data;

            // 2. Insert the main product
            const [newProduct] = await tx.insert(products).values(productData).returning();

            // 3. Process each variant
            for (const variantData of variantsData) {
                // Extract nested data from variant
                const {
                    sizes: sizesData,
                    colors: colorsData,
                    images: imagesData,
                    specs: specsData,
                    ...variantInfo
                } = variantData;

                // Insert variant with productId
                const [newVariant] = await tx.insert(variants).values({
                    variantName: variantInfo.variantName,
                    variantDescription: variantInfo.variantDescription,
                    slug: variantInfo.slug,
                    sku: variantInfo.sku,
                    keywords: variantInfo.keywords,
                    isSale: variantInfo.isSale,
                    saleEndDate: variantInfo.saleEndDate,
                    productId: newProduct.id,
                    weight: variantInfo.weight.toString(),
                    price: variantInfo.price ? variantInfo.price.toString() : null
                }).returning();

                // Insert sizes for this variant - convert numeric values to strings
                if (sizesData && sizesData.length > 0) {
                    const sizesWithVariantId = sizesData.map(size => ({
                        ...size,
                        variantId: newVariant.id,
                        price: size.price.toString(),
                        discount: size.discount.toString()
                    }));
                    await tx.insert(sizes).values(sizesWithVariantId);
                }

                // Insert colors for this variant
                if (colorsData && colorsData.length > 0) {
                    const colorsWithVariantId = colorsData.map(color => ({
                        ...color,
                        variantId: newVariant.id
                    }));
                    await tx.insert(colors).values(colorsWithVariantId);
                }

                // Insert images for this variant
                if (imagesData && imagesData.length > 0) {
                    const imagesWithVariantId = imagesData.map(image => ({
                        ...image,
                        variantId: newVariant.id
                    }));
                    await tx.insert(productVariantImages).values(imagesWithVariantId);
                }

                // Insert specs for this variant
                if (specsData && specsData.length > 0) {
                    const specsWithVariantId = specsData.map(spec => ({
                        ...spec,
                        variantId: newVariant.id
                    }));
                    await tx.insert(specs).values(specsWithVariantId);
                }
            }

            return newProduct;
        });

        const activeStore = await db.query.stores.findFirst({
            where: (store, {eq, and}) => and(
                eq(store.id, data.storeId),
                eq(store.status, "ACTIVE")
            ),
        });

        const storeSlug = activeStore?.slug

        // Revalidate the path after successful creation
        revalidatePath(`/dashboard/seller/stores/${storeSlug}/products`);

        return {
            success: true,
            message: `Product ${data.name} created successfully`,
            status: 201,
            data: result
        };

    } catch (error) {
        console.error('Error creating product:', error);

        return {
            success: false,
            message: 'Failed to create product. Please try again.',
            status: 500,
            data: null
        };
    }
}