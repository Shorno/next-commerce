"use client"

import { Button } from "@/components/ui/button"
import { deleteCategory } from "@/actions/admin/categoris"
import { useState } from "react"
import type { Category } from "@/db/schema"
import { toast } from "sonner"
import {BaseModal} from "@/components/base-modal";

interface ConfirmDeleteModalProps {
    category: Category
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConfirmDeleteModal({ category, open, onOpenChange }: ConfirmDeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await deleteCategory(category.id)
            if (response?.success) {
                toast.success(response.message || "Category deleted successfully")
                onOpenChange(false)
            } else {
                toast.error(response?.message || "Failed to delete category")
            }
        } catch (error) {
            console.error("Failed to delete category:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <BaseModal
            variant="alert"
            open={open}
            onOpenChange={onOpenChange}
            title="Delete Category"
            description={`Are you sure you want to delete "${category.name}"? This action cannot be undone.`}
        >
            <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isDeleting}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </BaseModal>
    )
}
