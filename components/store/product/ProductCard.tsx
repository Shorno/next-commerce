"use client"
import {ProductWithVariants, VariantWithRelations} from "@/db/schema";
import {Card, CardContent, CardFooter, CardHeader} from "@/components/ui/card";
import {useState} from "react";
import {Heart, ShoppingCart} from "lucide-react";
import {Button} from "@/components/ui/button";
import ImageSwiper from "@/components/store/product/ImageSwiper";
import Image from "next/image";

interface ProductCardProps {
    product: ProductWithVariants
}

export default function ProductCard({product}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const productVariants: VariantWithRelations[] = product.variants;
    const variantImages = productVariants.flatMap((variant) => variant.images);

    return (
        <Card
            className="group pt-0 relative overflow-visible border-0  rounded-3xl shadow-sm hover:shadow-md hover:rounded-b-none transition-all duration-300 max-w-64"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => {
                setIsHovered(false);
                setSelectedImage(null);
            }}
        >
            <CardHeader className="p-0">
                {selectedImage ? (
                    <div className="aspect-square relative">
                        <Image
                            src={selectedImage}
                            alt="Selected product image"
                            fill
                            className="object-cover rounded-t-3xl"
                        />
                    </div>
                ) : (
                    <ImageSwiper images={variantImages}/>
                )}
            </CardHeader>

            <CardContent className={"-mt-4"}>
                <h3 className="font-semibold line-clamp-2 leading-tight">
                    {product.name}
                </h3>
            </CardContent>

            {isHovered && (
                <CardFooter className={"-my-2 flex flex-col gap-4 absolute top-full left-0 right-0 z-10 bg-primary-foreground rounded-b-3xl border-t-0 shadow-lg p-4 "}>
                    <div className={"flex justify-start gap-2 w-full"}>
                        {variantImages.map((image) => (
                            <Image
                                key={image.id}
                                src={image.imageUrl}
                                alt={image.altText}
                                width={36}
                                height={36}
                                className={`inline-block size-10 rounded-full border cursor-pointer hover:border-primary`}
                                onMouseEnter={() => setSelectedImage(image.imageUrl)}
                            />
                        ))}
                    </div>
                    <div className={"flex justify-between gap-2"}>
                        <Button variant={"destructive"} size={"xl"} className={"rounded-3xl"}>
                            <ShoppingCart className="h-4 w-4 mr-2"/>
                            Add to Cart
                        </Button>
                        <Button
                            variant="outline"
                            size={"xl"}
                            className={`rounded-full size-11`}
                        >
                            <Heart/>
                        </Button>
                    </div>
                </CardFooter>
            )}
        </Card>
    )
}