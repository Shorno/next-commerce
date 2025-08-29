// EditCategoryForm.tsx
"use client"

import * as React from "react"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { LoaderIcon } from "lucide-react"
import { toast } from "sonner"
import SingleImageUpload from "@/components/single-image-upload"
import { updateCategory } from "@/actions/admin/categoris"
import { Category } from "@/db/schema"
import { CategoryFormData, categorySchema } from "@/zodSchema"

export function EditCategoryForm({
                                     category,
                                     onClose,
                                 }: {
    category: Category
    onClose: () => void
}) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(categorySchema),
        // Populate directly from the prop (no fetch)
        defaultValues: {
            name: category.name ?? "",
            image: category.image ?? "",
            slug: category.slug ?? "",
            featured: !!category.featured,
        },
    })

    function onSubmit(values: CategoryFormData) {
        startTransition(async () => {
            try {
                const res = await updateCategory(category.id, values)
                if (res?.success) {
                    toast.success(res.message ?? "Category updated")
                    onClose()
                } else {
                    toast.error(res?.message ?? "Failed to update")
                }
            } catch {
                toast.error("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Category Name</label>
                <Input {...form.register("name")} className="h-9" disabled={isPending} />
                <p className="text-xs text-destructive">{form.formState.errors.name?.message}</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">URL Slug</label>
                <Input
                    {...form.register("slug")}
                    className="h-9 font-mono text-sm"
                    onChange={(e) => {
                        const value = e.target.value
                            .toLowerCase()
                            .replace(/[^a-z0-9\s-]/g, "")
                            .replace(/\s+/g, "-")
                            .replace(/-+/g, "-")
                            .trim()
                        form.setValue("slug", value, { shouldValidate: true, shouldDirty: true })
                    }}
                    disabled={isPending}
                />
                <p className="text-xs text-destructive">{form.formState.errors.slug?.message}</p>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium">Category Image</label>
                <div className="rounded-lg p-3">
                    <SingleImageUpload
                        value={form.watch("image")}
                        onChange={(val) => form.setValue("image", val, { shouldValidate: true, shouldDirty: true })}
                        folder="categories"
                    />
                </div>
                <p className="text-xs text-destructive">{form.formState.errors.image?.message}</p>
            </div>

            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                <div className="text-sm font-medium">Featured Category</div>
                <Checkbox
                    checked={!!form.watch("featured")}
                    onCheckedChange={(v: boolean) => form.setValue("featured", v, { shouldDirty: true })}
                    className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                    disabled={isPending}
                />
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>Cancel</Button>
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <span className="inline-flex items-center gap-2">
              <LoaderIcon className="h-4 w-4 animate-spin" />Saving…
            </span>
                    ) : "Save Changes"}
                </Button>
            </div>
        </form>
    )
}
