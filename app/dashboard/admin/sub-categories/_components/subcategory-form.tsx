"use client"

import {useEffect, useState, useTransition} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {LoaderIcon, PlusIcon, Star} from "lucide-react"
import {toast} from "sonner"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import SingleImageUpload from "@/components/single-image-upload"
import type {Category, Subcategory} from "@/db/schema"
import {type SubcategoryFormData, subcategorySchema} from "@/zodSchema/category"
import {createSubcategory, updateSubcategory} from "@/actions/admin/subcategories";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {getAllCategories} from "@/actions/admin/categoris";

interface CategoryFormProps {
    mode: "create" | "edit"
    subcategory?: Subcategory
    onSuccess: () => void
    onCancel: () => void
}

export function SubcategoryForm({mode, subcategory, onSuccess, onCancel}: CategoryFormProps) {
    const [categories, setCategories] = useState<Category[]>([])
    const [isPending, startTransition] = useTransition()
    const isEdit = mode === "edit"


    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await getAllCategories();
            setCategories(categories);
        };
        fetchCategories();
    }, []);

    const form = useForm<SubcategoryFormData>({
        resolver: zodResolver(subcategorySchema),
        defaultValues: {
            name: subcategory?.name ?? "",
            image: subcategory?.image ?? "",
            slug: subcategory?.slug ?? "",
            featured: !!subcategory?.featured,
            categoryId: subcategory?.categoryId
        },
    })

    const handleSlugChange = (value: string) => {
        return value
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, "")
            .replace(/\s+/g, "-")
            .replace(/-+/g, "-")
            .trim()
    }

    function onSubmit(values: SubcategoryFormData) {
        startTransition(async () => {
            try {
                const response = isEdit && subcategory ? await updateSubcategory(subcategory.id, values) : await createSubcategory(values)
                if (response.success) {
                    toast.success(response.message)
                    form.reset()
                    onSuccess()
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                console.error("Unexpected error", error)
                toast.error("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Category</FormLabel>
                                    <Select
                                        value={field.value ? String(field.value) : undefined}
                                        onValueChange={(val) => field.onChange(Number(val))}
                                        disabled={isPending}
                                    >
                                        <FormControl>
                                            <SelectTrigger className="h-9">
                                                <SelectValue placeholder="Select a category"/>
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {categories.map((c) => (
                                                <SelectItem key={c.id} value={String(c.id)}>
                                                    {c.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Subcategory Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Smartphone" {...field} className="h-9"
                                               disabled={isPending}/>
                                    </FormControl>
                                    <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="slug"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">URL Slug</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="smartphone"
                                            {...field}
                                            className="h-9 font-mono text-sm"
                                            onChange={(e) => {
                                                const slug = handleSlugChange(e.target.value)
                                                field.onChange(slug)
                                            }}
                                            disabled={isPending}
                                        />
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        URL-friendly identifier (lowercase, hyphens only)
                                    </FormDescription>
                                    <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />
                    </div>
                </div>

                <FormField
                    control={form.control}
                    name="image"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel className="text-sm font-medium">Category Image</FormLabel>
                            <FormControl>
                                <div className="rounded-lg p-3">
                                    <SingleImageUpload value={field.value} onChange={field.onChange}
                                                       folder="categories"/>
                                </div>
                            </FormControl>
                            <FormDescription className="text-xs text-muted-foreground">
                                Upload an image (4:3 aspect ratio recommended)
                            </FormDescription>
                            <FormMessage className="text-xs"/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="featured"
                    render={({field}) => (
                        <FormItem>
                            <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                                        <Star className="w-4 h-4"/>
                                    </div>
                                    <div>
                                        <FormLabel className="text-sm font-medium text-foreground">Featured
                                            Subcategory</FormLabel>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Display prominently on homepage
                                        </FormDescription>
                                    </div>
                                </div>
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                                        disabled={isPending}
                                    />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onCancel}
                        className="h-9 bg-transparent"
                        disabled={isPending}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" className="h-9 min-w-[120px]" disabled={isPending}>
                        {isPending ? (
                            <div className="flex items-center space-x-2">
                                <LoaderIcon className="w-4 h-4 animate-spin"/>
                                <span>{isEdit ? "Saving..." : "Creating..."}</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                {!isEdit && <PlusIcon className="w-4 h-4"/>}
                                <span>{isEdit ? "Save Changes" : "Create Subcategory"}</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
