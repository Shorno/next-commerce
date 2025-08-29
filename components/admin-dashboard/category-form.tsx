"use client"

import {zodResolver} from "@hookform/resolvers/zod"
import {useForm} from "react-hook-form"
import {z} from "zod"

import {Button} from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
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
import {useState, useTransition} from "react";
import {toast} from "sonner";
import {LoaderIcon, PlusIcon, Star} from "lucide-react";
import SingleImageUpload from "@/components/single-image-upload";
import {createCategory} from "@/actions/admin/categoris";

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

interface CategoryFormModalProps {
    trigger?: React.ReactNode;
}

export default function CategoryFormModal({
                                              trigger,
                                          }: CategoryFormModalProps) {
    const [open, setOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

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
                    setOpen(false)
                    form.reset()
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || <Button><PlusIcon/> New Category</Button>}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto">
                <DialogHeader className="pb-3">
                    <DialogTitle className="text-xl font-semibold">Create New Category</DialogTitle>
                    <DialogDescription className="text-sm text-muted-foreground">
                        Add a new category to organize your content.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-medium">Category Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Technology"
                                                    {...field}
                                                    className="h-9"
                                                />
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
                                                    placeholder="technology"
                                                    {...field}
                                                    className="h-9 font-mono text-sm"
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
                                            <FormDescription className="text-xs text-muted-foreground">
                                                URL-friendly identifier (lowercase, hyphens only)
                                            </FormDescription>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Image Upload Section */}
                        <FormField
                            control={form.control}
                            name="image"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-medium">Category Image</FormLabel>
                                    <FormControl>
                                        <div className="rounded-lg p-3">
                                            <SingleImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                folder="categories"
                                            />
                                        </div>
                                    </FormControl>
                                    <FormDescription className="text-xs text-muted-foreground">
                                        Upload an image (4:3 aspect ratio recommended)
                                    </FormDescription>
                                    <FormMessage className="text-xs"/>
                                </FormItem>
                            )}
                        />

                        {/* Featured Toggle */}
                        <FormField
                            control={form.control}
                            name="featured"
                            render={({field}) => (
                                <FormItem>
                                    <div className="flex items-center justify-between p-3 rounded-lg border bg-muted/20">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 text-amber-600">
                                                <Star className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <FormLabel className="text-sm font-medium text-foreground">
                                                    Featured Category
                                                </FormLabel>
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
                                            />
                                        </FormControl>
                                    </div>
                                </FormItem>
                            )}
                        />

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-2 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="h-9"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-9 min-w-[120px]"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <LoaderIcon className="w-4 h-4 animate-spin"/>
                                        <span>Creating...</span>
                                    </div>
                                ) : (
                                    "Create Category"
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}