import {db} from "@/db";
import {ProductWithVariants} from "@/db/schema";



export async function getAllProducts() : Promise<ProductWithVariants[]> {
    try {
        return await db.query.products.findMany({
            with: {
                variants: {
                    with: {
                        images: true,
                        sizes : true,
                        colors : true,
                        specs: true
                    }
                },
            }
        });
    } catch (error) {
        console.error("Failed to fetch products:", error);
        return [];
    }
}