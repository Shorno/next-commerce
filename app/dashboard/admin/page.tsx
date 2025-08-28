"use client"
import TestUpload from "@/components/TestUpload";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";

export default function AdminDashboardPage() {
    return (
        <div>
           admin dashboard page
            <TestUpload/>
            <CloudinaryUploadWidget onChange={(url) => console.log(url)}/>
        </div>
    )
}