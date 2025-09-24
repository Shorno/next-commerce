"use client"
import {ProductWithVariants, VariantWithRelations} from "@/db/schema";
import {Card, CardContent, CardHeader} from "@/components/ui/card";
import {useState} from "react";
import {Heart, ShoppingCart} from "lucide-react";
import {Button} from "@/components/ui/button";
import ImageSwiper from "@/components/store/product/ImageSwiper";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";

interface ProductCardProps {
    product: ProductWithVariants
}

export default function ProductCard({product}: ProductCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const productVariants: VariantWithRelations[] = product.variants;
    const variantImages = productVariants.flatMap((variant) => variant.images);

    const supportsHover = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches;

    return (
        <motion.div
            className="group pt-0 relative overflow-visible border-0 rounded-3xl shadow-sm hover:shadow-md transition-shadow duration-300 w-64"
            whileHover={supportsHover ? { borderRadius: "24px 24px 0px 0px" } : {}}
            onHoverStart={() => supportsHover && setIsHovered(true)}
            onHoverEnd={() => {
                if (supportsHover) {
                    setIsHovered(false);
                    setSelectedImage(null);
                }
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <Card className="border-0 pt-0 shadow-none bg-transparent">
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

                <CardContent className="-my-4">
                    <h3 className="font-semibold line-clamp-2 leading-tight mb-4">
                        {product.name}
                    </h3>

                    {/* Always show on mobile, hover on desktop */}
                    <div className={`${supportsHover ? 'hidden' : 'block'}`}>
                        <div className="flex justify-start gap-2 w-full mb-4">
                            {variantImages.slice(0, 4).map((image) => (
                                <Image
                                    key={image.id}
                                    src={image.imageUrl}
                                    alt={image.altText}
                                    width={32}
                                    height={32}
                                    className="inline-block size-8 rounded-full border cursor-pointer"
                                    onClick={() => setSelectedImage(image.imageUrl)}
                                />
                            ))}
                        </div>
                        <div className="flex justify-between gap-2 pb-2">
                            <Button variant="destructive" size="sm" className="rounded-2xl flex-1">
                                <ShoppingCart className="h-4 w-4 mr-1"/>
                                Add to Cart
                            </Button>
                            <Button variant="outline" size="sm" className="rounded-full aspect-square">
                                <Heart className="h-4 w-4"/>
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Desktop hover content */}
            <AnimatePresence>
                {isHovered && supportsHover && (
                    <motion.div
                        key="footer"
                        initial={{ opacity: 0, y: -20, height: 0 }}
                        animate={{ opacity: 1, y: 0, height: "auto" }}
                        exit={{ opacity: 0, y: -20, height: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="flex flex-col gap-4 absolute top-full left-0 right-0 z-10 bg-primary-foreground rounded-b-3xl border-t-0 shadow-lg overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex justify-start gap-2 w-full mb-4">
                                {variantImages.map((image) => (
                                    <Image
                                        key={image.id}
                                        src={image.imageUrl}
                                        alt={image.altText}
                                        width={36}
                                        height={36}
                                        className="inline-block size-10 rounded-full border cursor-pointer hover:border-primary transition-colors"
                                        onMouseEnter={() => setSelectedImage(image.imageUrl)}
                                    />
                                ))}
                            </div>
                            <div className="flex justify-between gap-2">
                                <Button variant="destructive" size="xl" className="rounded-3xl">
                                    <ShoppingCart className="h-4 w-4 mr-2"/>
                                    Add to Cart
                                </Button>
                                <Button variant="outline" size="xl" className="rounded-full size-11">
                                    <Heart/>
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}
