"use client"

import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Category } from "@/db/schema"
import {EditCategoryForm} from "@/components/admin-dashboard/edit-category-form";

export function EditCategoryModal({
                                      trigger,
                                      category,
                                  }: {
    trigger: React.ReactNode
    category: Category
}) {
    const [open, setOpen] = React.useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
                <DialogHeader><DialogTitle>Edit Category</DialogTitle></DialogHeader>
                {/* Render only when open and key by id so RHF defaultValues are reapplied */}
                {open ? (
                    <EditCategoryForm
                        key={category.id}
                        category={category}
                        onClose={() => setOpen(false)}
                    />
                ) : null}
            </DialogContent>
        </Dialog>
    )
}
