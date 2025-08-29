"use client"
import {Button} from "@/components/ui/button"
import {deleteCategory} from "@/actions/admin/categoris"
import {useState} from "react"
import type {Category} from "@/db/schema"
import {BaseModal} from "@/components/admin-dashboard/base-modal";

interface ConfirmDeleteProps {
    category: Category
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConfirmDelete({category, open, onOpenChange}: ConfirmDeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            await deleteCategory(category.id)
            onOpenChange(false)
        } catch (error) {
            console.error("Failed to delete category:", error)
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
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                    {isDeleting ? "Deleting..." : "Delete"}
                </Button>
            </div>
        </BaseModal>
    )
}
