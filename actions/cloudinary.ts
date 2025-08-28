"use server"
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!,
})

export async function uploadSingleImageToCloudinary(formData: FormData) {
    try {
        const file = formData.get('file') as File
        const folder = formData.get('folder') as string || 'uploads'

        if (!file) {
            return { success: false, error: 'No file provided' }
        }

        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml', "image/webp"]
        if (!allowedTypes.includes(file.type)) {
            return {
                success: false,
                error: 'Invalid file type. Please upload JPG, PNG, GIF, or SVG files.'
            }
        }

        // Validate file size (2MB)
        const maxSize = 2 * 1024 * 1024 // 2MB
        if (file.size > maxSize) {
            return {
                success: false,
                error: 'File too large. Please upload files smaller than 2MB.'
            }
        }

        // Convert file to base64
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const base64File = `data:${file.type};base64,${buffer.toString('base64')}`

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(base64File, {
            folder: folder,
            resource_type: 'auto',
            quality: 'auto',
            fetch_format: 'auto',
        })

        return {
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
        }

    } catch (error) {
        console.error('Cloudinary upload error:', error)
        return {
            success: false,
            error: 'Failed to upload image. Please try again.',
        }
    }
}


export async function deleteImageFromCloudinary(publicId: string) {
    try {
        const result = await cloudinary.uploader.destroy(publicId)

        return {
            success: result.result === 'ok',
            message: result.result === 'ok' ? 'Image deleted successfully' : 'Failed to delete image'
        }
    } catch (error) {
        console.error('Cloudinary delete error:', error)
        return {
            success: false,
            error: 'Failed to delete image'
        }
    }
}

