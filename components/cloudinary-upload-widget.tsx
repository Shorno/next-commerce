"use client"

import {Button} from "@/components/ui/button"
import {cn} from "@/lib/utils"
import {Upload, X, ImageIcon} from "lucide-react"
import {CldUploadWidget} from "next-cloudinary"

export type UploadType = "profile" | "cover" | "standard"

interface CloudinaryUploadWidgetProps {
    value?: string
    onChange: (url: string) => void
    onRemove?: () => void
    uploadType?: UploadType
    className?: string
    disabled?: boolean
    onWidgetOpen?: () => void
    onWidgetClose?: () => void

}

const uploadConfigs = {
    profile: {
        cropping: true,
        croppingAspectRatio: 1,
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,
        gravity: "face",
        transformation: {
            width: 400,
            height: 400,
            crop: "fill",
            quality: "auto",
            format: "auto",
        },
    },
    cover: {
        cropping: true,
        croppingAspectRatio: 16 / 9,
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,
        transformation: {
            width: 1200,
            height: 675,
            crop: "fill",
            quality: "auto",
            format: "auto",
        },
    },
    standard: {
        cropping: true,
        croppingAspectRatio: 4 / 3,
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,
        transformation: {
            width: 800,
            height: 600,
            crop: "fill",
            quality: "auto",
            format: "auto",
        },
    },
}

const previewStyles = {
    profile: "aspect-square rounded-full",
    cover: "aspect-video rounded-lg",
    standard: "aspect-[4/3] rounded-lg",
}

export default function CloudinaryUploadWidget({
                                                   value,
                                                   onChange,
                                                   onRemove,
                                                   uploadType = "standard",
                                                   className,
                                                   disabled = false,
                                                   onWidgetClose,
                                                   onWidgetOpen
                                               }: CloudinaryUploadWidgetProps) {
    const config = uploadConfigs[uploadType]


    const getUploadTypeLabel = () => {
        switch (uploadType) {
            case "profile":
                return "Profile Image"
            case "cover":
                return "Cover Image"
            case "standard":
                return "Image"
            default:
                return "Image"
        }
    }

    const getUploadTypeDescription = () => {
        switch (uploadType) {
            case "profile":
                return "Square aspect ratio, optimized for profile pictures"
            case "cover":
                return "16:9 aspect ratio, perfect for cover images"
            case "standard":
                return "4:3 aspect ratio, standard image format"
            default:
                return "Upload an image"
        }
    }

    const handleRemove = () => {
        if (onRemove && !disabled) {
            onRemove()
        }
    }

    return (
        <div className={cn("space-y-4", className)}>
            {value ? (
                <div className="relative group">
                    <div
                        className={cn(
                            "w-full max-w-sm mx-auto overflow-hidden border-2 border-dashed border-border",
                            previewStyles[uploadType],
                        )}
                    >
                        <img
                            src={value || "/placeholder.svg"}
                            alt={`${getUploadTypeLabel()} preview`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    {!disabled && (
                        <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={handleRemove}
                        >
                            <X className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            ) : (
                <div className={cn("w-full max-w-sm mx-auto", previewStyles[uploadType])}>
                    <div
                        className="w-full h-full border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center bg-muted/50 hover:bg-muted/80 transition-colors">
                        <ImageIcon className="h-8 w-8 text-muted-foreground mb-2"/>
                        <p className="text-sm text-muted-foreground text-center px-2">
                            No {getUploadTypeLabel().toLowerCase()} selected
                        </p>
                    </div>
                </div>
            )}

            <div className="flex flex-col gap-2">
                <CldUploadWidget
                    uploadPreset={"next_ecommerce"}
                    options={{
                        cloudName: "doxn3qvm3",
                        sources: ["local", "url"],
                        multiple: false,
                        maxFiles: 1,
                        resourceType: "image",
                        clientAllowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
                        maxFileSize: 10000000,
                        ...config,
                    }}
                    onSuccess={(result: any) => {
                        if (result?.info?.secure_url) {
                            onChange(result.info.secure_url)
                        }
                    }}
                    onError={(error: any) => {
                        console.error("Cloudinary upload error:", error)
                    }}
                    onClose={() => {
                        onWidgetClose?.()
                    }}
                >
                    {({open}) => (
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => {
                                if (disabled) return
                                // NEW: let parent know right before opening
                                onWidgetOpen?.()
                                open?.()
                            }}
                            disabled={disabled}
                            className="w-full bg-transparent"
                        >
                            <Upload className="h-4 w-4 mr-2"/>
                            {value ? `Change ${getUploadTypeLabel()}` : `Upload ${getUploadTypeLabel()}`}
                        </Button>
                    )}
                </CldUploadWidget>

                <p className="text-xs text-muted-foreground text-center">{getUploadTypeDescription()}</p>
            </div>
        </div>
    )
}
