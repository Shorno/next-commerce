"use client"

import type React from "react"

import { AlertCircleIcon, ImageIcon, UploadIcon, XIcon, LoaderIcon } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { uploadSingleImageToCloudinary, deleteImageFromCloudinary } from "@/actions/cloudinary"
import { getPublicIdFromUrl } from "@/utils/getPublicIdFromUrl"

interface CloudinaryImageGridProps {
  value?: string[]
  onChange?: (urls: string[]) => void
  folder?: string
  maxFiles?: number
  maxSizeMB?: number
}

interface ImageItem {
  id: string
  url: string
  isUploading?: boolean
  isDeleting?: boolean
}

export default function CloudinaryImageGrid({
                                              value = [],
                                              onChange,
                                              folder = "variants",
                                              maxFiles = 6,
                                              maxSizeMB = 2,
                                            }: CloudinaryImageGridProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [images, setImages] = useState<ImageItem[]>(() => value.map((url, index) => ({ id: `existing-${index}`, url })))
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const maxSize = maxSizeMB * 1024 * 1024

  const updateImages = (newImages: ImageItem[]) => {
    setImages(newImages)
    const urls = newImages.filter((img) => !img.isUploading && !img.isDeleting).map((img) => img.url)
    onChange?.(urls)
  }

  const handleFileUpload = async (files: FileList) => {
    setError(null)
    const fileArray = Array.from(files)

    // Validate file count
    if (images.length + fileArray.length > maxFiles) {
      setError(`Maximum ${maxFiles} images allowed`)
      return
    }

    // Validate each file
    for (const file of fileArray) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/svg+xml", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        setError("Invalid file type. Please upload JPG, PNG, GIF, SVG, or WebP files.")
        return
      }

      if (file.size > maxSize) {
        setError(`File too large. Please upload files smaller than ${maxSizeMB}MB.`)
        return
      }
    }

    // Add uploading placeholders
    const uploadingImages = fileArray.map((file, index) => ({
      id: `uploading-${Date.now()}-${index}`,
      url: URL.createObjectURL(file),
      isUploading: true,
    }))

    const newImages = [...images, ...uploadingImages]
    updateImages(newImages)

    // Upload files one by one
    for (let i = 0; i < fileArray.length; i++) {
      const file = fileArray[i]
      const uploadingId = uploadingImages[i].id

      startTransition(async () => {
        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("folder", folder)

          const result = await uploadSingleImageToCloudinary(formData)

          if (result.success && result.url) {
            setImages((prev) =>
                prev.map((img) => (img.id === uploadingId ? { ...img, url: result.url!, isUploading: false } : img)),
            )
            toast.success("Image uploaded successfully!")
          } else {
            setImages((prev) => prev.filter((img) => img.id !== uploadingId))
            setError(result.error || "Failed to upload image")
            toast.error(result.error || "Failed to upload image")
          }
        } catch (error) {
          setImages((prev) => prev.filter((img) => img.id !== uploadingId))
          const errorMessage = "Failed to upload image. Please try again."
          setError(errorMessage)
          toast.error(errorMessage)
          console.error("Upload error:", error)
        }
      })
    }
  }

  const removeImage = (imageId: string) => {
    const imageToRemove = images.find((img) => img.id === imageId)
    if (!imageToRemove) return

    const publicId = getPublicIdFromUrl(imageToRemove.url)

    if (publicId && !imageToRemove.isUploading) {
      // Mark as deleting
      setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isDeleting: true } : img)))

      startTransition(async () => {
        try {
          const result = await deleteImageFromCloudinary(publicId)

          if (result.success) {
            setImages((prev) => prev.filter((img) => img.id !== imageId))
            toast.success("Image deleted successfully")
          } else {
            setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isDeleting: false } : img)))
            toast.error(result.error || "Failed to delete image")
          }
        } catch (error) {
          setImages((prev) => prev.map((img) => (img.id === imageId ? { ...img, isDeleting: false } : img)))
          console.error("Delete error:", error)
          toast.error("Failed to delete image")
        }
      })
    } else {
      // Remove locally (for uploading images or images without public ID)
      setImages((prev) => prev.filter((img) => img.id !== imageId))
      if (imageToRemove.isUploading) {
        URL.revokeObjectURL(imageToRemove.url)
      }
    }
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

    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files)
    }
  }

  const openFileDialog = () => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = "image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
    input.multiple = true
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files
      if (files && files.length > 0) {
        handleFileUpload(files)
      }
    }
    input.click()
  }

  return (
      <div className="flex flex-col gap-2">
        {/* Drop area */}
        <div
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            data-dragging={isDragging || undefined}
            data-files={images.length > 0 || undefined}
            className=""
        >
          <input
              className="sr-only"
              aria-label="Upload image files"
              type="file"
              multiple
              accept="image/svg+xml,image/png,image/jpeg,image/jpg,image/gif,image/webp"
          />
          {images.length > 0 ? (
              <div className="flex w-full flex-col gap-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-medium">
                    Uploaded Images ({images.filter((img) => !img.isUploading && !img.isDeleting).length})
                  </h3>
                  <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={openFileDialog}
                      disabled={images.length >= maxFiles || isPending}
                  >
                    <UploadIcon className="-ms-0.5 size-3.5 opacity-60" aria-hidden="true" />
                    Add more
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {images.map((image) => (
                      <div key={image.id} className="bg-accent relative aspect-square rounded-md overflow-hidden p-2">
                        {image.isUploading || image.isDeleting ? (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <div className="text-center text-white">
                                <LoaderIcon className="size-6 animate-spin mx-auto mb-2" />
                                <p className="text-xs">{image.isUploading ? "Uploading..." : "Deleting..."}</p>
                              </div>
                            </div>
                        ) : null}
                        <div className="relative w-full h-full rounded overflow-hidden">
                          <Image src={image.url || "/placeholder.svg"} alt="Variant image" fill className="object-cover" />
                        </div>
                        <Button
                            type="button"
                            onClick={() => removeImage(image.id)}
                            size="icon"
                            className="bg-red-500 hover:bg-red-600 border-white focus-visible:border-white absolute top-1 right-1 size-6 rounded-full border-2 shadow-sm text-white"
                            aria-label="Remove image"
                            disabled={image.isDeleting}
                        >
                          {image.isDeleting ? <LoaderIcon className="size-3 animate-spin" /> : <XIcon className="size-3.5" />}
                        </Button>
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
                <p className="mb-1.5 text-sm font-medium">Drop your images here</p>
                <p className="text-muted-foreground text-xs">SVG, PNG, JPG, GIF or WebP (max. {maxSizeMB}MB each)</p>
                <Button type="button" variant="outline" className="mt-4 bg-transparent" onClick={openFileDialog}>
                  <UploadIcon className="-ms-1 opacity-60" aria-hidden="true" />
                  Select images
                </Button>
              </div>
          )}
        </div>

        {error && (
            <div className="text-destructive flex items-center gap-1 text-xs" role="alert">
              <AlertCircleIcon className="size-3 shrink-0" />
              <span>{error}</span>
            </div>
        )}
      </div>
  )
}