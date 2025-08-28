"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"

import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Checkbox} from "@/components/ui/checkbox"
import {useTransition} from "react";
import {createCategory} from "@/actions/admin/create-category";
import {toast} from "sonner";
import {LoaderIcon} from "lucide-react";
import CloudinaryUploadWidget from "@/components/cloudinary-upload-widget";
import {useRouter} from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Category name is required.",
    }).max(255, {
        message: "Category name must be less than 255 characters.",
    }),
    image: z.string().min(1, {
        message: "Image URL is required.",
    }),
    slug: z.string().min(1, {
        message: "Slug is required.",
    }).max(100, {
        message: "Slug must be less than 100 characters.",
    }).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
        message: "Slug must contain only lowercase letters, numbers, and hyphens.",
    }),
    featured: z.boolean().default(false).nonoptional(),
})

export type CategoryFormData = z.infer<typeof formSchema>


export default function NewCategoryPage() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter()

    const form = useForm<CategoryFormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            image: "",
            slug: "",
            featured: false,
        },
    })

    function onSubmit(values: CategoryFormData) {
        startTransition(async () => {
            try {
                const response = await createCategory(values)
                if (response.success) {
                    toast.success(response.message)
                    form.reset()
                    router.push("/dashboard/admin/categories")
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
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 lg:max-w-1/2 mx-auto py-16">

                <FormField
                    control={form.control}
                    name="image"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category Image</FormLabel>
                            <FormControl>
                                <CloudinaryUploadWidget
                                    value={field.value}
                                    onChange={field.onChange}
                                    onRemove={() => field.onChange("")}
                                    uploadType="standard"
                                    disabled={isPending}
                                />
                            </FormControl>
                            <FormDescription>Upload an image for the category (4:3 aspect ratio
                                recommended).</FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter category name" {...field} />
                            </FormControl>
                            <FormDescription>
                                The name of the category (max 255 characters).
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />


                <FormField
                    control={form.control}
                    name="slug"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Slug</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="category-slug"
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value.toLowerCase()
                                            .replace(/[^a-z0-9\s-]/g, '')
                                            .replace(/\s+/g, '-')
                                            .replace(/-+/g, '-')
                                            .trim();
                                        field.onChange(value);
                                    }}
                                />
                            </FormControl>
                            <FormDescription>
                                URL-friendly version (max 100 characters).
                            </FormDescription>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="featured"
                    render={({field}) => (
                        <FormItem
                            className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                            <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel>Featured Category</FormLabel>
                                <FormDescription>
                                    Mark as featured to display prominently.
                                </FormDescription>
                            </div>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2">
                    <Button type="submit" className={"w-40"}>
                        {
                            isPending ? <LoaderIcon className={"animate-spin"}/> : "Add New Category"
                        }
                    </Button>
                </div>
            </form>
        </Form>
    )
}
