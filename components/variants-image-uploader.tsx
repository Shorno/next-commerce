"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon, LoaderIcon } from "lucide-react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {uploadSingleImageToCloudinary} from "@/actions/cloudinary";

interface VariantImage {
    imageUrl: string
    altText: string
}

interface VariantsImageUploaderProps {
    value: VariantImage[]
    onChange: (images: VariantImage[]) => void
    maxFiles?: number
    maxSizeMB?: number
    folder?: string
}

export default function VariantsImageUploader({
                                                  value = [],
                                                  onChange,
                                                  maxFiles = 6,
                                                  maxSizeMB = 2,
                                                  folder = "products/variants",
                                              }: VariantsImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const [uploadingFiles, setUploadingFiles] = useState<Set<string>>(new Set())
    const [errors, setErrors] = useState<string[]>([])

    const maxSize = maxSizeMB * 1024 * 1024

    const validateFile = (file: File): string | null => {
        const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"]

        if (!allowedTypes.includes(file.type)) {
            return "Invalid file type. Please upload JPG, PNG, GIF, SVG, or WebP files."
        }

        if (file.size > maxSize) {
            return `File too large. Please upload files smaller than ${maxSizeMB}MB.`
        }

        return null
    }

    const uploadFile = async (file: File, index: number): Promise<VariantImage | null> => {
        const tempId = `temp-${Date.now()}-${Math.random()}`
        setUploadingFiles((prev) => new Set([...prev, tempId]))

        try {
            const formData = new FormData()
            formData.append("file", file)
            formData.append("folder", folder)

            const result = await uploadSingleImageToCloudinary(formData)

            if (result.success && result.url) {
                return {
                    imageUrl: result.url,
                    altText: `Variant image ${value.length + index + 1}`,
                }
            } else {
                setErrors((prev) => [...prev, result.error || "Upload failed"])
                return null
            }
        } catch  {
            setErrors((prev) => [...prev, "Upload failed. Please try again."])
            return null
        } finally {
            setUploadingFiles((prev) => {
                const newSet = new Set(prev)
                newSet.delete(tempId)
                return newSet
            })
        }
    }

    const handleFiles = async (files: FileList) => {
        setErrors([])

        const fileArray = Array.from(files)
        const remainingSlots = maxFiles - value.length
        const filesToProcess = fileArray.slice(0, remainingSlots)

        // Validate all files first
        const validationErrors: string[] = []
        filesToProcess.forEach((file) => {
            const error = validateFile(file)
            if (error) validationErrors.push(error)
        })

        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            return
        }

        // Upload files
        const uploadPromises = filesToProcess.map((file, index) => uploadFile(file, index))
        const results = await Promise.all(uploadPromises)

        const successfulUploads = results.filter((result): result is VariantImage => result !== null)

        if (successfulUploads.length > 0) {
            onChange([...value, ...successfulUploads])
        }
    }

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }, [])

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.currentTarget === e.target) {
            setIsDragging(false)
        }
    }, [])

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }, [])

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault()
            e.stopPropagation()
            setIsDragging(false)

            const files = e.dataTransfer.files
            if (files.length > 0) {
                handleFiles(files)
            }
        },
        [value, maxFiles, folder],
    )

    const openFileDialog = () => {
        const input = document.createElement("input")
        input.type = "file"
        input.multiple = true
        input.accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
        input.onchange = (e) => {
            const files = (e.target as HTMLInputElement).files
            if (files) {
                handleFiles(files)
            }
        }
        input.click()
    }

    const removeImage = (imageIndex: number) => {
        onChange(value.filter((_, index) => index !== imageIndex))
    }

    const isUploading = uploadingFiles.size > 0

    return (
        <div className="flex flex-col gap-2">
            {/* Drop area */}
            <div
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                data-dragging={isDragging || undefined}
                data-files={value.length > 0 || undefined}
                className={`${
                    isDragging ? "bg-accent/50" : ""
                } ${isUploading ? "pointer-events-none opacity-75" : ""}`}
            >
                {value.length > 0 ? (
                    <div className="flex w-full flex-col gap-3">
                        <div className="flex items-center justify-between gap-2">
                            <h3 className="truncate text-sm font-medium">
                                Variant Images ({value.length}/{maxFiles})
                            </h3>
                            <Button
                                variant="outline"
                                size="sm"
                                type={"button"}
                                onClick={openFileDialog}
                                disabled={value.length >= maxFiles || isUploading}
                            >
                                <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                                Add more
                            </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                            {value.map((image, index) => (
                                <div key={index} className="bg-accent relative aspect-square rounded-md">
                                    <Image src={image.imageUrl || "/placeholder.svg"} alt={image.altText} fill className="object-cover rounded-lg" />
                                    <Button
                                        onClick={() => removeImage(index)}
                                        size="icon"
                                        className="border-background focus-visible:border-background absolute -top-2 -right-2 size-6 rounded-full border-2 shadow-none bg-red-500 hover:bg-red-600"
                                        aria-label="Remove image"
                                    >
                                        <XIcon className="size-3.5 text-white" />
                                    </Button>
                                </div>
                            ))}

                            {Array.from(uploadingFiles).map((tempId) => (
                                <div
                                    key={tempId}
                                    className="bg-accent relative aspect-square rounded-md flex items-center justify-center"
                                >
                                    <LoaderIcon className="size-6 animate-spin text-muted-foreground" />
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center px-4 py-3 text-center">
                        <div
                            className="bg-background mb-2 flex size-11 shrink-0 items-center justify-center rounded-full border"
                            aria-hidden="true"
                        >
                            <ImageIcon className="size-4 opacity-60" />
                        </div>
                        <p className="mb-1.5 text-sm font-medium">Drop variant images here</p>
                        <p className="text-muted-foreground text-xs">SVG, PNG, JPG, GIF or WebP (max. {maxSizeMB}MB each)</p>
                        <Button type={"button"} variant="outline" className="mt-4 bg-transparent" onClick={openFileDialog} disabled={isUploading}>
                            <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                            Select images
                        </Button>
                    </div>
                )}
            </div>

            {errors.length > 0 && (
                <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
                    <AlertCircleIcon className="size-3 shrink-0" />
                    <span>{errors[0]}</span>
                </div>
            )}
        </div>
    )
}
