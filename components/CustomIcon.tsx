import Image from "next/image";

export default function CustomIcon({
                                       src,
                                       alt,
                                       width = 32,
                                       height = 32
                                   }: {
    src: string, alt: string, width?: number, height?: number
}) {
    return (
        <Image src={src} alt={alt} width={width} height={height}/>
    )
}