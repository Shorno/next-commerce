"use client"

import type React from "react"
import { CategoryForm } from "./category-form"
import type { Category } from "@/db/schema"
import {BaseModal} from "@/components/admin-dashboard/category/base-modal";

interface CategoryModalProps {
    mode: "create" | "edit"
    category?: Category
    open: boolean
    onOpenChange: (open: boolean) => void
    trigger?: React.ReactNode
}

export function CategoryModal({ mode, category, open, onOpenChange, trigger }: CategoryModalProps) {
    const isEdit = mode === "edit"

    const handleSuccess = () => {
        onOpenChange(false)
    }

    return (
        <BaseModal
            variant="dialog"
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Category" : "Create New Category"}
            description={isEdit ? "Update the category information below." : "Add a new category to organize your content."}
            className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto"
            trigger={trigger}
        >
            <CategoryForm mode={mode} category={category} onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
        </BaseModal>
    )
}
