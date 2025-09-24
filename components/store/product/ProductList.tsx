import {getAllProducts} from "@/actions/store/product";
import ProductCard from "@/components/store/product/ProductCard";

export default async function ProductList() {
    const products = await getAllProducts();
    return (
        <div className={"container mx-auto px-4 "}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {products.map((product)=> (
                    <ProductCard key={product.id} product={product}/>
                ))}
            </div>
        </div>
    )
}
