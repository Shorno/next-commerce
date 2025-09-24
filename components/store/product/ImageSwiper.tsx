import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {ProductVariantImage} from "@/db/schema";
import Image from "next/image";


interface ImageSwiperProps {
    images: ProductVariantImage[];
}

export default function ImageSwiper({images}: ImageSwiperProps) {


    return (
        <Carousel
        >
            <CarouselContent>
                {images.map((image) => (
                    <CarouselItem key={image.id}>
                        <Image src={image.imageUrl} alt={image.altText} height={256} width={256}
                               className={"w-full h-64 object-cover rounded-t-3xl"}
                        />
                    </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselPrevious className={"left-2 opacity-0 group-hover:opacity-100 transition-opacity"}/>
            <CarouselNext className={"right-2 opacity-0 group-hover:opacity-100 transition-opacity"}/>
        </Carousel>
    )
}