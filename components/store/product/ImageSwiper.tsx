import {
    Carousel, CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {ProductVariantImage} from "@/db/schema";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import Autoplay from "embla-carousel-autoplay";

interface ImageSwiperProps {
    images: ProductVariantImage[];
}

export default function ImageSwiper({images}: ImageSwiperProps) {
    const autoPlay = useRef(Autoplay({delay: 1000, stopOnInteraction: false}))
    const [api, setApi] = useState<CarouselApi>()

    useEffect(() => {
        if (!api) return;

        autoPlay.current.stop();

        const handleMouseEnter = () => autoPlay.current.play();
        const handleMouseLeave = () => autoPlay.current.stop();

        api.containerNode().addEventListener('mouseenter', handleMouseEnter);
        api.containerNode().addEventListener("mouseleave", handleMouseLeave);

        return () => {
            api.containerNode().removeEventListener('mouseenter', handleMouseEnter);
            api.containerNode().removeEventListener("mouseleave", handleMouseLeave);
        }

    }, [api]);


    return (
        <>
            <Carousel
                plugins={[autoPlay.current]}
                opts={{loop: true}}
                setApi={setApi}
            >
                <CarouselContent>
                    {
                        images.map((image) => (
                            <CarouselItem key={image.id}>
                                <Image src={image.imageUrl} alt={image.altText} height={200} width={200}
                                       className={"w-full h-64 object-cover rounded-t-3xl"}
                                />
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className={"left-2 opacity-0 group-hover:opacity-100 transition-opacity"}/>
                <CarouselNext className={"right-2 opacity-0 group-hover:opacity-100 transition-opacity"}/>
            </Carousel>
        </>
    )
}