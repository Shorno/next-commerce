"use client"
import { BaseModal } from "./base-modal"
import type { Category } from "@/db/schema"
import { EditCategoryForm } from "@/components/admin-dashboard/edit-category-form"

interface EditCategoryModalProps {
    category: Category
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function EditCategoryModal({ category, open, onOpenChange }: EditCategoryModalProps) {
    return (
        <BaseModal
            variant="dialog"
            open={open}
            onOpenChange={onOpenChange}
            title="Edit Category"
            className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto"
        >
            <EditCategoryForm key={category.id} category={category} onClose={() => onOpenChange(false)} />
        </BaseModal>
    )
}
