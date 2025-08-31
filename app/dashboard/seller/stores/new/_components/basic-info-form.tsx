"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form"
import { BasicInfoFormData, basicInfoSchema } from "@/zodSchema/store"
import { Input } from "@/components/ui/input"
import { useStoreForm } from "@/store/storeFormStore"
import { Textarea } from "@/components/ui/textarea"
import { useEffect, useState } from "react"
import { StoreIcon, Camera, XIcon, LoaderIcon } from "lucide-react"
import SingleImageUpload from "@/components/single-image-upload"
import Image from "next/image"

export default function BasicInfoForm() {
    const { data, setFormData } = useStoreForm()
    const [isHydrated, setIsHydrated] = useState(false)

    const form = useForm<BasicInfoFormData>({
        resolver: zodResolver(basicInfoSchema),
        defaultValues: {
            name: data?.name || "",
            slug: data?.slug || "",
            description: data?.description || "",
            logo: data?.logo || "",
        },
    })

    useEffect(() => {
        setIsHydrated(true)
        form.reset({
            name: data?.name || "",
            slug: data?.slug || "",
            description: data?.description || "",
            logo: data?.logo || "",
        })
    }, [data, form])

    if (!isHydrated) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl border border-border/50 p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="h-12 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-1/4"></div>
                        <div className="h-12 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    const handleSlug = (value: string) =>
        value.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-")

    return (
        <div className="max-w-4xl mx-auto">
            <Form {...form}>
                <form className="space-y-0" onChange={() => setFormData(form.getValues())}>
                    <div className="bg-card rounded-2xl border border-border/50 p-8 space-y-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Logo Upload Section */}
                            <div className="lg:w-1/3">
                                <div className="space-y-2 mb-4">
                                    <FormLabel className="text-sm font-semibold text-foreground">Store Logo</FormLabel>
                                </div>

                                <FormField
                                    control={form.control}
                                    name="logo"
                                    render={({ field }) => (
                                        <FormItem>
                                            <div className="relative">
                                                <FormControl>
                                                    <SingleImageUpload
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        folder="stores/logos"
                                                        className="border-0 bg-transparent"
                                                        showError={false}
                                                    >
                                                        {({ isDragging, isPending, isDeleting, previewUrl, openFileDialog, removeImage }) => (
                                                            <div
                                                                className={`aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-2xl border-2 border-dashed border-primary/20 overflow-hidden group hover:border-primary/40 transition-all duration-300 cursor-pointer ${
                                                                    isDragging ? "border-primary/60 bg-primary/10" : ""
                                                                }`}
                                                                onClick={!previewUrl ? openFileDialog : undefined}
                                                            >
                                                                {isPending || isDeleting ? (
                                                                    <div className="h-full flex flex-col items-center justify-center">
                                                                        <LoaderIcon className="w-8 h-8 animate-spin text-primary mb-3" />
                                                                        <p className="text-sm font-medium text-foreground">
                                                                            {isPending ? "Uploading..." : "Removing..."}
                                                                        </p>
                                                                    </div>
                                                                ) : previewUrl ? (
                                                                    <div className="relative h-full group">
                                                                        <Image
                                                                            src={previewUrl || "/placeholder.svg"}
                                                                            alt="Store logo"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                            <div className="flex gap-2">
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        openFileDialog()
                                                                                    }}
                                                                                    className="bg-background/90 backdrop-blur-sm rounded-lg p-2 hover:bg-background transition-colors"
                                                                                >
                                                                                    <Camera className="w-5 h-5 text-foreground" />
                                                                                </button>
                                                                                <button
                                                                                    type="button"
                                                                                    onClick={(e) => {
                                                                                        e.stopPropagation()
                                                                                        removeImage()
                                                                                    }}
                                                                                    className="bg-red-500/90 backdrop-blur-sm rounded-lg p-2 hover:bg-red-600 transition-colors"
                                                                                >
                                                                                    <XIcon className="w-4 h-4 text-white" />
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                                                                            <StoreIcon className="w-8 h-8 text-primary" />
                                                                        </div>
                                                                        <p className="text-base font-semibold text-foreground mb-2">Upload Store Logo</p>
                                                                        <p className="text-sm text-muted-foreground mb-1">Click or drag & drop</p>
                                                                        <p className="text-xs text-muted-foreground opacity-75">
                                                                            Square format recommended
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </SingleImageUpload>
                                                </FormControl>
                                            </div>
                                            <FormMessage className="text-xs mt-2" />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            {/* Store Name and Description */}
                            <div className="lg:w-2/3 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold text-foreground">
                                                    Store Name
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your store name"
                                                        {...field}
                                                        onChange={(e) => {
                                                            field.onChange(e.target.value)
                                                            form.setValue("slug", handleSlug(e.target.value))
                                                        }}
                                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold text-foreground">
                                                    URL Slug
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="your-store-url"
                                                        {...field}
                                                        className="h-12 text-base font-mono bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                        onChange={(e) => {
                                                            const slug = handleSlug(e.target.value)
                                                            field.onChange(slug)
                                                        }}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Auto-generated from store name
                                                </FormDescription>
                                                <FormMessage className="text-xs" />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-foreground">
                                                Store Description
                                            </FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell customers about your store, what makes you unique, and what products you offer..."
                                                    className="min-h-[150px] resize-none text-base bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Share your story and what makes your store special
                                            </FormDescription>
                                            <FormMessage className="text-xs" />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}