"use client"

import {useTransition} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {LoaderIcon, PlusIcon, Mail, Phone, Truck, Clock, Camera, Upload, StoreIcon, XIcon, Save} from "lucide-react"
import {toast} from "sonner"
import {Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import SingleImageUpload from "@/components/single-image-upload"
import {type StoreSubmissionData, storeSubmissionSchema} from "@/zodSchema/store"
import type {Store} from "@/db/schema"
import Image from "next/image";
import {updateStore} from "@/actions/store/updateStore";
import {useRouter} from "next/navigation";

interface StoreFormProps {
    mode: "create" | "edit"
    store?: Store
    onSuccess?: () => void
    onCancel?: () => void
}

export default function EditStoreForm({mode, store}: StoreFormProps) {
    const [isPending, startTransition] = useTransition()
    const isEdit = mode === "edit"
    const router = useRouter();


    const form = useForm<StoreSubmissionData>({
        resolver: zodResolver(storeSubmissionSchema),
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

    function onSubmit(values: StoreSubmissionData) {
        startTransition(async () => {
            try {
                if (!store?.id) {
                    throw new Error("Store ID is required for update")
                }
                const result = await updateStore(store.id, values)
                if (result.success) {
                    if (result.redirectUrl) {
                        router.replace(result.redirectUrl)
                    }
                    toast.success(result.message)
                } else {
                    toast.error(result.message)
                }
                if (!isEdit) {
                    form.reset()
                }
            } catch (error) {
                console.error("Unexpected error", error)
                toast.error("Something went wrong. Please try again.")
            }
        })
    }

    return (
        <div className="min-h-screen">
            {/* Header Section */}
            <div className="border-b border-border/50 bg-background">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">
                                {isEdit ? "Store Settings" : "Create New Store"}
                            </h1>
                            <p className="text-muted-foreground mt-2">
                                {isEdit ? "Manage your store information and preferences" : "Set up your new store with all the necessary details"}
                            </p>
                        </div>
                        <div className="hidden sm:flex items-center gap-3">
                            <Button
                                type="button"
                                variant="outline"
                                className="h-10 px-6"
                                disabled={isPending}
                                onClick={() => window.history.back()}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form Content */}
            <div className="max-w-6xl mx-auto md:px-4 py-8">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">

                        {/* Store Branding Section */}
                        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
                                <h2 className="text-xl font-semibold text-foreground">Store Branding</h2>
                                <p className="text-sm text-muted-foreground mt-1">Upload your store logo and cover
                                    image</p>
                            </div>
                            <div className="p-6 space-y-8">
                                {/* Cover Image */}
                                <FormField
                                    name="cover"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium text-foreground">Cover
                                                Image</FormLabel>
                                            <div
                                                className="relative h-48 lg:h-64 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-xl overflow-hidden group hover:border-primary/40 transition-all duration-300">
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
                                                                                <Camera
                                                                                    className="w-6 h-6 text-foreground"/>
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
                                                                                    <Upload
                                                                                        className="w-8 h-8 text-primary"/>
                                                                                </div>
                                                                                <h3 className="text-lg font-semibold text-foreground mb-2">Add
                                                                                    Cover Photo</h3>
                                                                                <p className="text-sm text-muted-foreground max-w-sm">
                                                                                    Upload a stunning cover image that
                                                                                    represents your store's brand and
                                                                                    personality
                                                                                </p>
                                                                                <p className="text-xs text-muted-foreground mt-2 opacity-75">
                                                                                    Recommended: 16:9 ratio
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
                                            <FormMessage className="text-xs mt-2"/>
                                        </FormItem>
                                    )}
                                />

                                {/* Logo Upload */}
                                <div className="flex justify-center items-center max-w-64 mx-auto gap-8">
                                    <div>
                                        <FormField
                                            control={form.control}
                                            name="logo"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-base font-medium text-foreground">Store
                                                        Logo</FormLabel>
                                                    <div className="relative">
                                                        <FormControl>
                                                            <SingleImageUpload
                                                                value={field.value}
                                                                onChange={field.onChange}
                                                                folder="stores/logos"
                                                                className="border-0 bg-transparent"
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
                                                                    <div
                                                                        className={`aspect-square bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-dashed border-primary/20 overflow-hidden group hover:border-primary/40 transition-all duration-300 cursor-pointer ${
                                                                            isDragging ? "border-primary/60 bg-primary/10" : ""
                                                                        }`}
                                                                        onClick={!previewUrl ? openFileDialog : undefined}
                                                                    >
                                                                        {isPending || isDeleting ? (
                                                                            <div
                                                                                className="h-full flex flex-col items-center justify-center">
                                                                                <LoaderIcon
                                                                                    className="w-8 h-8 animate-spin text-primary mb-3"/>
                                                                                <p className="text-sm font-medium text-foreground">
                                                                                    {isPending ? "Uploading..." : "Removing..."}
                                                                                </p>
                                                                            </div>
                                                                        ) : previewUrl ? (
                                                                            <div className="relative h-full group">
                                                                                <Image
                                                                                    src={previewUrl || "/placeholder.svg"}
                                                                                    alt="Store logo"
                                                                                    className="w-full h-full object-cover"
                                                                                    width={400}
                                                                                    height={400}
                                                                                />
                                                                                <div
                                                                                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                                    <div className="flex gap-2">
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                openFileDialog()
                                                                                            }}
                                                                                            className="bg-background/90 backdrop-blur-sm rounded-lg p-2 hover:bg-background transition-colors"
                                                                                        >
                                                                                            <Camera
                                                                                                className="w-5 h-5 text-foreground"/>
                                                                                        </button>
                                                                                        <button
                                                                                            type="button"
                                                                                            onClick={(e) => {
                                                                                                e.stopPropagation()
                                                                                                removeImage()
                                                                                            }}
                                                                                            className="bg-red-500/90 backdrop-blur-sm rounded-lg p-2 hover:bg-red-600 transition-colors"
                                                                                        >
                                                                                            <XIcon
                                                                                                className="w-5 h-5 text-white"/>
                                                                                        </button>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        ) : (
                                                                            <div
                                                                                className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                                                <div
                                                                                    className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors duration-300">
                                                                                    <StoreIcon
                                                                                        className="w-6 h-6 text-primary"/>
                                                                                </div>
                                                                                <p className="text-sm font-medium text-foreground mb-1">Upload
                                                                                    Logo</p>
                                                                                <p className="text-xs text-muted-foreground">Square
                                                                                    format recommended</p>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </SingleImageUpload>
                                                        </FormControl>
                                                    </div>
                                                    <FormMessage className="text-xs mt-2"/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Basic Information Section */}
                        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
                                <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>
                                <p className="text-sm text-muted-foreground mt-1">Essential details about your store</p>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-base font-medium text-foreground">Store
                                                    Name</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Enter your store name"
                                                        {...field}
                                                        onChange={(e) => {
                                                            const value = handleNameChange(e.target.value)
                                                            field.onChange(value)
                                                        }}
                                                        className="h-12 text-base"
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
                                                <FormLabel className="text-base font-medium text-foreground">URL
                                                    Slug</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="your-store-url"
                                                        {...field}
                                                        className="h-12 text-base font-mono"
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
                                            <FormLabel className="text-base font-medium text-foreground">Store
                                                Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Tell customers about your store, what makes you unique, and what products you offer..."
                                                    className="min-h-[120px] resize-none text-base"
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

                        {/* Contact Information Section */}
                        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                                        <Mail className="w-4 h-4 text-blue-500"/>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>
                                        <p className="text-sm text-muted-foreground">How customers can reach you</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="email"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="text-base font-medium text-foreground flex items-center gap-2">
                                                    <Mail className="w-4 h-4 text-primary"/>
                                                    Email Address
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="email"
                                                        placeholder="contact@yourstore.com"
                                                        {...field}
                                                        className="h-12 text-base"
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
                                                    className="text-base font-medium text-foreground flex items-center gap-2">
                                                    <Phone className="w-4 h-4 text-primary"/>
                                                    Phone Number
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="tel"
                                                        placeholder="+1 (555) 123-4567"
                                                        {...field}
                                                        className="h-12 text-base"
                                                        disabled={isPending}
                                                    />
                                                </FormControl>
                                                <FormMessage className="text-xs"/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping & Delivery Section */}
                        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                                        <Truck className="w-4 h-4 text-emerald-500"/>
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-semibold text-foreground">Shipping & Delivery</h2>
                                        <p className="text-sm text-muted-foreground">Configure your shipping options</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="defaultShippingService"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="text-base font-medium text-foreground flex items-center gap-2">
                                                    <Truck className="w-4 h-4 text-primary"/>
                                                    Shipping Service
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Standard Shipping"
                                                        {...field}
                                                        className="h-12 text-base"
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
                                                <FormLabel className="text-base font-medium text-foreground">Shipping
                                                    Cost</FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <span
                                                            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-medium">$</span>
                                                        <Input
                                                            type="text"
                                                            placeholder="0.00"
                                                            {...field}
                                                            className="h-12 text-base pl-10"
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

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <FormField
                                        control={form.control}
                                        name="minimumDeliveryTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel
                                                    className="text-base font-medium text-foreground flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary"/>
                                                    Minimum Delivery Time
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder="1"
                                                            value={field.value || ""}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                            className="h-12 text-base pr-16"
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
                                                    className="text-base font-medium text-foreground flex items-center gap-2">
                                                    <Clock className="w-4 h-4 text-primary"/>
                                                    Maximum Delivery Time
                                                </FormLabel>
                                                <FormControl>
                                                    <div className="relative">
                                                        <Input
                                                            type="number"
                                                            placeholder="7"
                                                            value={field.value || ""}
                                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                            className="h-12 text-base pr-16"
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
                        </div>

                        {/* Policies Section */}
                        <div className="bg-card rounded-xl border border-border/50 overflow-hidden">
                            <div className="px-6 py-4 border-b border-border/50 bg-muted/20">
                                <h2 className="text-xl font-semibold text-foreground">Store Policies</h2>
                                <p className="text-sm text-muted-foreground mt-1">Define your store policies and
                                    terms</p>
                            </div>
                            <div className="p-6">
                                <FormField
                                    control={form.control}
                                    name="returnPolicy"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="text-base font-medium text-foreground">Return
                                                Policy</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Describe your return and refund policy. For example: '30-day return policy for unused items in original packaging...'"
                                                    className="min-h-[120px] resize-none text-base"
                                                    {...field}
                                                    disabled={isPending}
                                                />
                                            </FormControl>
                                            <FormDescription className="text-xs text-muted-foreground">
                                                Help customers understand your return process
                                            </FormDescription>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div
                            className="sticky bottom-0 backdrop-blur-sm border-t border-border/50 p-4 -mx-4 sm:-mx-6 lg:-mx-8">
                            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                                <div className="text-sm text-muted-foreground">
                                </div>
                                <div className="flex items-center gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="h-10 px-6"
                                        disabled={isPending}
                                        onClick={() => window.history.back()}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="h-10 px-8 min-w-[140px]"
                                        disabled={isPending}
                                    >
                                        {isPending ? (
                                            <div className="flex items-center space-x-2">
                                                <LoaderIcon className="w-4 h-4 animate-spin"/>
                                                <span>{isEdit ? "Saving..." : "Creating..."}</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center space-x-2">
                                                {isEdit ? <Save className="w-4 h-4"/> : <PlusIcon className="w-4 h-4"/>}
                                                <span>{isEdit ? "Save Changes" : "Create Store"}</span>
                                            </div>
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
