"use client"

import { Button } from "@/components/ui/button"
import { useState } from "react"
import type {Subcategory} from "@/db/schema"
import { toast } from "sonner"
import {BaseModal} from "@/components/base-modal";
import {deleteSubcategory} from "@/actions/admin/subcategories";

interface ConfirmDeleteModalProps {
    subcategory: Subcategory
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function ConfirmDeleteSubModal({ subcategory, open, onOpenChange }: ConfirmDeleteModalProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    const handleDelete = async () => {
        setIsDeleting(true)
        try {
            const response = await deleteSubcategory(subcategory.id)
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
            description={`Are you sure you want to delete "${subcategory.name}"? This action cannot be undone.`}
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
