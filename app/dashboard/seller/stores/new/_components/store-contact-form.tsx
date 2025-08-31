"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { StoreContactFormData, storeContactSchema } from "@/zodSchema/store"
import { Input } from "@/components/ui/input"
import { useStoreForm } from "@/store/storeFormStore"
import { useEffect, useState } from "react"
import { Mail, Phone, Upload, Camera, XIcon, LoaderIcon } from "lucide-react"
import SingleImageUpload from "@/components/single-image-upload"
import Image from "next/image"

export default function StoreContactForm() {
    const { data, setFormData } = useStoreForm()
    const [isHydrated, setIsHydrated] = useState(false)

    const form = useForm<StoreContactFormData>({
        resolver: zodResolver(storeContactSchema),
        defaultValues: {
            cover: data?.cover || "",
            email: data?.email || "",
            phone: data?.phone || "",
        },
    })

    useEffect(() => {
        setIsHydrated(true)
        form.reset({
            cover: data?.cover || "",
            email: data?.email || "",
            phone: data?.phone || "",
        })
    }, [data, form])

    if (!isHydrated) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="animate-pulse space-y-6">
                    <div className="h-48 bg-muted rounded-t-2xl"></div>
                    <div className="bg-card rounded-b-2xl border border-t-0 p-8 space-y-6">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-12 bg-muted rounded"></div>
                            <div className="h-12 bg-muted rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Form {...form}>
                <form className="space-y-0" onChange={() => setFormData(form.getValues())}>
                    {/* Cover Photo Section */}
                    <div className="relative rounded-t-2xl overflow-hidden">
                        <FormField
                            name="cover"
                            render={({ field }) => (
                                <FormItem>
                                    <div className="relative h-48 sm:h-56 lg:h-72 bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 border-2 border-dashed border-primary/20 rounded-t-2xl overflow-hidden group hover:border-primary/40 transition-all duration-300">
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
                                                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
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
                                                                        <LoaderIcon className="w-8 h-8 animate-spin text-primary mb-4"/>
                                                                        <p className="text-sm font-medium">{isPending ? "Uploading" : "Deleting"}</p>
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                                                                            <Upload className="w-8 h-8 text-primary"/>
                                                                        </div>
                                                                        <h3 className="text-lg font-semibold text-foreground mb-2">Add Cover Photo</h3>
                                                                        <p className="text-sm text-muted-foreground max-w-sm">
                                                                            Upload a stunning cover image that represents your store's brand and personality
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

                    {/* Contact Information Section */}
                    <div className="bg-card rounded-b-2xl border border-t-0 border-border/50 p-8">
                        <div className="bg-gradient-to-br from-background to-muted/20 rounded-2xl border border-border/50 p-6 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
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
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Mail className="w-4 h-4 text-primary"/>
                                                Email Address
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="contact@yourstore.com"
                                                    {...field}
                                                    className="h-12 text-base bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-sm font-semibold text-foreground flex items-center gap-2">
                                                <Phone className="w-4 h-4 text-primary"/>
                                                Phone Number
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="tel"
                                                    placeholder="+1 (555) 123-4567"
                                                    {...field}
                                                    className="h-12 text-base bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
                                                />
                                            </FormControl>
                                            <FormMessage className="text-xs"/>
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