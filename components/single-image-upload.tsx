"use client"

import type React from "react"
import { AlertCircleIcon, LoaderIcon } from "lucide-react"
import { useState, useTransition, type ReactNode } from "react"
import { toast } from "sonner"
import { deleteImageFromCloudinary, uploadSingleImageToCloudinary } from "@/actions/cloudinary"
import { getPublicIdFromUrl } from "@/utils/getPublicIdFromUrl"
import Image from "next/image";

interface SingleImageUploadProps {
    value?: string
    onChange?: (url: string) => void
    folder?: string
    children?: (props: {
        isDragging: boolean
        isPending: boolean
        isDeleting: boolean
        previewUrl: string
        openFileDialog: () => void
        removeImage: () => void
        error: string | null
    }) => ReactNode
    className?: string
    dragActiveClassName?: string
    showError?: boolean
}

export default function SingleImageUpload({
                                              value,
                                              onChange,
                                              folder = "categories",
                                              children,
                                              className,
                                              dragActiveClassName,
                                              showError = true,
                                          }: SingleImageUploadProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [isPending, startTransition] = useTransition()
    const [isDeleting, startDeleteTransition] = useTransition()
    const [error, setError] = useState<string | null>(null)
    const [previewUrl, setPreviewUrl] = useState<string>(value || "")

    const handleFileUpload = async (file: File) => {
        setError(null)

        startTransition(async () => {
            try {
                const formData = new FormData()
                formData.append("file", file)
                formData.append("folder", folder)

                const result = await uploadSingleImageToCloudinary(formData)

                if (result.success && result.url) {
                    setPreviewUrl(result.url)
                    onChange?.(result.url)
                    toast.success("Image uploaded successfully!")
                } else {
                    setError(result.error || "Failed to upload image")
                    toast.error(result.error || "Failed to upload image")
                }
            } catch (error) {
                const errorMessage = "Failed to upload image. Please try again."
                setError(errorMessage)
                toast.error(errorMessage)
                console.error("Upload error:", error)
            }
        })
    }

    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        const files = Array.from(e.dataTransfer.files)
        if (files.length > 0 && files[0]) {
            handleFileUpload(files[0])
        }
    }

    const openFileDialog = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif, image/webp"
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (file) {
                handleFileUpload(file)
            }
        }
        input.click()
    }

    const removeImage = () => {
        if (previewUrl) {
            const publicId = getPublicIdFromUrl(previewUrl)

            if (publicId) {
                startDeleteTransition(async () => {
                    try {
                        const result = await deleteImageFromCloudinary(publicId)

                        if (result.success) {
                            setPreviewUrl("")
                            onChange?.("")
                            setError(null)
                            toast.success("Image deleted successfully")
                        } else {
                            toast.error(result.error || "Failed to delete image")
                        }
                    } catch (error) {
                        console.error("Delete error:", error)
                        toast.error("Failed to delete image")
                    }
                })
            } else {
                setPreviewUrl("")
                onChange?.("")
                setError(null)
                toast.warning("Image removed from form (could not delete from cloud)")
            }
        } else {
            setPreviewUrl("")
            onChange?.("")
            setError(null)
        }
    }

    if (children) {
        return (
            <div className="flex flex-col gap-2">
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    className={`${className || ""} ${isDragging ? dragActiveClassName || "" : ""}`}
                >
                    {children({
                        isDragging,
                        isPending,
                        isDeleting,
                        previewUrl,
                        openFileDialog,
                        removeImage,
                        error,
                    })}
                </div>

                {showError && error && (
                    <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                        <AlertCircleIcon className="size-3 shrink-0" />
                        <span>{error}</span>
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <div
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    data-dragging={isDragging || undefined}
                    className={`border-input data-[dragging=true]:bg-accent/50 has-[input:focus]:border-ring has-[input:focus]:ring-ring/50 relative flex min-h-52 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed p-4 transition-colors has-[input:focus]:ring-[3px] ${className || ""}`}
                >
                    {isPending || isDeleting ? (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <LoaderIcon className="size-8 animate-spin mb-2 opacity-60" />
                            <p className="text-sm font-medium">{isPending ? "Uploading to Cloudinary..." : "Deleting image..."}</p>
                        </div>
                    ) : previewUrl ? (
                        <div className="absolute inset-0 flex items-center justify-center p-4">
                            <Image
                                src={previewUrl || "/placeholder.svg"}
                                alt="Uploaded image"
                                className="mx-auto max-h-full rounded object-contain"
                                width={300}
                                height={300}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                            <p className="mb-1.5 text-sm font-medium">Drop your image here</p>
                            <p className="text-muted-foreground text-xs">SVG, PNG, JPG or GIF (max. 2MB)</p>
                            <button
                                type="button"
                                className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md"
                                onClick={openFileDialog}
                                disabled={isPending || isDeleting}
                            >
                                Select image
                            </button>
                        </div>
                    )}
                </div>

                {previewUrl && !isPending && !isDeleting && (
                    <div className="absolute top-4 right-4">
                        <button
                            type="button"
                            className="focus-visible:border-ring focus-visible:ring-ring/50 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-red-600/80 text-white transition-[color,box-shadow] outline-none hover:bg-red-700/90 focus-visible:ring-[3px]"
                            onClick={removeImage}
                            aria-label="Delete image from Cloudinary"
                        >
                            {isDeleting ? <LoaderIcon className="size-4 animate-spin" /> : <span className="text-lg">×</span>}
                        </button>
                    </div>
                )}
            </div>

            {showError && error && (
                <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{error}</span>
                </div>
            )}
        </div>
    )
}
