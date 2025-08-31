"use client"

import {useTransition} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {LoaderIcon, PlusIcon, Mail, Phone, Truck, Clock, Camera, Upload, StoreIcon, XIcon} from "lucide-react"
import {toast} from "sonner"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import SingleImageUpload from "@/components/single-image-upload"
import {type StoreFormData, storeSchema} from "@/zodSchema/store"
import type {Store} from "@/db/schema"
import Image from "next/image";

interface StoreFormProps {
    mode: "create" | "edit"
    store?: Store
    onSuccess?: () => void
    onCancel?: () => void
}

export function StoreForm({mode, store}: StoreFormProps) {
    const [isPending, startTransition] = useTransition()
    const isEdit = mode === "edit"

    const form = useForm<StoreFormData>({
        resolver: zodResolver(storeSchema),
        defaultValues: {
            name: store?.name ?? "",
            description: store?.description ?? "",
            email: store?.email ?? "",
            phone: store?.phone ?? "",
            slug: store?.slug ?? "",
            logo: store?.logo ?? "",
            cover: store?.cover ?? "",
            featured: !!store?.featured,
            returnPolicy: store?.returnPolicy ?? "",
            defaultShippingService: store?.defaultShippingService ?? "",
            defaultShippingCost: store?.defaultShippingCost ?? "0",
            minimumDeliveryTime: store?.minimumDeliveryTime ? Number(store.minimumDeliveryTime) : 0,
            maximumDeliveryTime: store?.maximumDeliveryTime ? Number(store.maximumDeliveryTime) : 0,
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

    const handleNameChange = (value: string) => {
        const slug = handleSlugChange(value)
        form.setValue("slug", slug)
        return value
    }

    function onSubmit(values: StoreFormData) {
        startTransition(async () => {
            try {
                // For now, just log the values as requested
                console.log("Store form values:", values)
                toast.success(isEdit ? "Store updated successfully!" : "Store created successfully!")
                form.reset()
            } catch (error) {
                console.error("Unexpected error", error)
                toast.error("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <div className="max-w-6xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                    <div className="relative rounded-t-2xl  overflow-hidden">
                        <FormField
                            name="cover"
                            render={({field}) => (
                                <FormItem>
                                    <div
                                        className="relative h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-t-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300">
                                        <FormControl>
                                            <SingleImageUpload
                                                value={field.value}
                                                onChange={field.onChange}
                                                folder="stores/covers"
                                                className="absolute inset-0"
                                                showError={false}
                                            >
                                                {({
                                                      isDragging,
                                                      isPending,
                                                      isDeleting,
                                                      previewUrl,
                                                      openFileDialog,
                                                      removeImage
                                                  }) => (
                                                    <>
                                                        {previewUrl ? (
                                                            <div className="relative h-full">
                                                                <Image
                                                                    src={previewUrl || "/placeholder.svg"}
                                                                    alt="Store cover"
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                                <div
                                                                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <div
                                                                        className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                                                                        <Camera className="w-6 h-6 text-foreground"/>
                                                                    </div>
                                                                </div>
                                                                {!isPending && !isDeleting && (
                                                                    <button
                                                                        type="button"
                                                                        className="absolute top-4 right-4 z-50 flex size-8 cursor-pointer items-center justify-center rounded-full bg-red-600/80 text-white transition-[color,box-shadow] outline-none hover:bg-red-700/90"
                                                                        onClick={removeImage}
                                                                        aria-label="Delete image"
                                                                    >
                                                                        <XIcon className="size-4"/>
                                                                    </button>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className={`h-full flex flex-col items-center justify-center text-center p-8 cursor-pointer transition-all duration-300 ${
                                                                    isDragging ? "bg-primary/10 border-primary/40" : ""
                                                                }`}
                                                                onClick={openFileDialog}
                                                            >
                                                                {isPending || isDeleting ? (
                                                                    <>
                                                                        <LoaderIcon
                                                                            className="w-8 h-8 animate-spin text-primary mb-4"/>
                                                                        <p className="text-sm font-medium">{isPending ? "Uploading" : "Deleting"}</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div
                                                                            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                                                                            <Upload className="w-8 h-8 text-primary"/>
                                                                        </div>
                                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Add
                                                                            Cover Photo</h3>
                                                                        <p className="text-sm text-muted-foreground max-w-sm">
                                                                            Upload a stunning cover image that
                                                                            represents your store's brand and
                                                                            personality
                                                                        </p>
                                                                        <p className="text-xs text-muted-foreground mt-2 opacity-75">
                                                                            Recommended: (16:9 ratio)
                                                                        </p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </SingleImageUpload>
                                        </FormControl>
                                    </div>
                                    <FormMessage className="text-xs mt-2 px-6"/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className="bg-card rounded-b-2xl border border-t-0 p-8 space-y-8">
                        <div className="flex flex-col lg:flex-row gap-8">
                            <div className="lg:w-1/3">
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
                                                                            {isPending ? "Uploading logo..." : "Removing logo..."}
                                                                        </p>
                                                                    </div>
                                                                ) : previewUrl ? (
                                                                    <div className="relative h-full group">
                                                                        <img
                                                                            src={previewUrl || "/placeholder.svg"}
                                                                            alt="Store logo"
                                                                            className="w-full h-full object-cover"
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
                                                                                    <span className="text-white text-lg leading-none">×</span>
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
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold text-foreground">Store
                                                    Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your store name"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = handleNameChange(e.target.value)
                                                            field.onChange(value)
                                                        }}
                                                        className="h-12 text-base bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                        disabled={isPending}
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
                                                <FormLabel className="text-sm font-semibold text-foreground">URL
                                                    Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="your-store-url"
                                                        {...field}
                                                        className="h-12 text-base font-mono bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                        onChange={(e) => {
                                                            const slug = handleSlugChange(e.target.value)
                                                            field.onChange(slug)
                                                        }}
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormDescription className="text-xs text-muted-foreground">
                                                    Auto-generated from store name
                                                </FormDescription>
                                                <FormMessage className="text-xs"/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-foreground">Store
                                                Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell customers about your store, what makes you unique, and what products you offer..."
                                                    className="min-h-[120px] resize-none text-base bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Share your story and what makes your store special
                                            </FormDescription>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Contact Information Card */}
                        <div
                            className="bg-gradient-to-br from-background to-muted/20 rounded-2xl border border-border/50 p-6 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Contact Information</h3>
                                    <p className="text-sm text-muted-foreground">How customers can reach you</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary"/>
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="contact@yourstore.com"
                                                    {...field}
                                                    className="h-12 text-base bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary"/>
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    {...field}
                                                    className="h-12 text-base bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Shipping & Delivery Card */}
                        <div
                            className="bg-gradient-to-br from-background to-muted/20 rounded-2xl border border-border/50 p-6 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center">
                                    <Truck className="w-5 h-5 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Shipping & Delivery</h3>
                                    <p className="text-sm text-muted-foreground">Configure your shipping options</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="defaultShippingService"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Truck className="w-4 h-4 text-primary"/>
                                                Shipping Service
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Standard Shipping"
                                                    {...field}
                                                    className="h-12 text-base bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Your primary shipping method
                                            </FormDescription>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultShippingCost"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-foreground">Shipping
                                                Cost</FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-medium">$</span>
                                                    <Input
                                                        type="text"
                                                        placeholder="0.00"
                                                        {...field}
                                                        className="h-12 text-base pl-10 bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                        disabled={isPending}
                                                    />
                                                </div>
                                            </FormControl>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Default shipping cost in USD
                                            </FormDescription>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <FormField
                                    control={form.control}
                                    name="minimumDeliveryTime"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary"/>
                                                Minimum Delivery
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="1"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                        className="h-12 text-base pr-16 bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                        disabled={isPending}
                                                        min="0"
                                                        max="365"
                                                    />
                                                    <span
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">days</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="maximumDeliveryTime"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel
                                                className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Clock className="w-4 h-4 text-primary"/>
                                                Maximum Delivery
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <Input
                                                        type="number"
                                                        placeholder="7"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                        className="h-12 text-base pr-16 bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                        disabled={isPending}
                                                        min="0"
                                                        max="365"
                                                    />
                                                    <span
                                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">days</span>
                                                </div>
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        {/* Return Policy Section */}
                        <div className="space-y-4">
                            <FormField
                                control={form.control}
                                name="returnPolicy"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-base font-semibold text-foreground">Return
                                            Policy</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your return and refund policy. For example: '30-day return policy for unused items in original packaging...'"
                                                className="min-h-[120px] resize-none text-base bg-background/50 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                {...field}
                                                disabled={isPending}
                                            />
                                        </FormControl>
                                        <FormDescription className="text-xs text-muted-foreground">
                                            Optional: Help customers understand your return process
                                        </FormDescription>
                                        <FormMessage className="text-xs"/>
                                    </FormItem>
                                )}
                            />
                        </div>



                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-8 border-t border-border/50">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-12 px-8 text-base font-medium border-border/50 hover:bg-muted/50 transition-all duration-200"
                                disabled={isPending}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="h-12 px-8 text-base font-semibold min-w-[160px] bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-200"
                                disabled={isPending}
                            >
                                {isPending ? (
                                    <div className="flex items-center space-x-2">
                                        <LoaderIcon className="w-5 h-5 animate-spin"/>
                                        <span>{isEdit ? "Saving..." : "Creating..."}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        {!isEdit && <PlusIcon className="w-5 h-5"/>}
                                        <span>{isEdit ? "Save Changes" : "Create Store"}</span>
                                    </div>
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </div>
    )
}