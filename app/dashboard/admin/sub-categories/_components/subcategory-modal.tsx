"use client"

import type React from "react"
import type {Subcategory} from "@/db/schema"
import {BaseModal} from "@/components/base-modal";
import {SubcategoryForm} from "@/app/dashboard/admin/sub-categories/_components/subcategory-form";

interface CategoryModalProps {
    mode: "create" | "edit"
    subcategory?: Subcategory
    open: boolean
    onOpenChange: (open: boolean) => void
    trigger?: React.ReactNode
}

export function SubcategoryModal({ mode, subcategory, open, onOpenChange, trigger}: CategoryModalProps) {
    const isEdit = mode === "edit"

    const handleSuccess = () => {
        onOpenChange(false)
    }

    return (
        <BaseModal
            variant="dialog"
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? "Edit Subcategory" : "Create New Subcategory"}
            description={isEdit ? "Update the subcategory information below." : "Add a new subcategory to organize your content."}
            className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto"
            trigger={trigger}
        >
            <SubcategoryForm mode={mode} subcategory={subcategory} onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
        </BaseModal>
    )
}
