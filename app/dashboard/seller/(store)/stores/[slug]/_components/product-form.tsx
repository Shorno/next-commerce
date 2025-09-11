"use client"

import {useTransition} from "react"
import {useForm, useFieldArray} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Plus,
    Trash2,
    Package,
    ImageIcon,
    Palette,
    Ruler,
    FileText,
    LoaderIcon,
    Camera,
    XIcon,
    Info, Pipette,
} from "lucide-react"

import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Separator} from "@/components/ui/separator"
import {Badge} from "@/components/ui/badge"
import {HexColorPicker} from "react-colorful"

import {productSchema, type ProductFormData} from "@/zodSchema/product"
import {useQuery, useQuery as useReactQuery} from "@tanstack/react-query"
import {categoryOptions, subCategoryOptions} from "@/data/product"
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select"
import SingleImageUpload from "@/components/single-image-upload"
import Image from "next/image"
import CloudinaryImageGrid from "@/components/cloudinary-image-grid";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import createProduct from "@/actions/store/createProduct";
import {toast} from "sonner";

export default function ProductForm({activeStoreId}: { activeStoreId?: number }) {
    const [isPending, startTransition] = useTransition()

    const {data: categories} = useReactQuery(categoryOptions)


    const form = useForm<ProductFormData>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            description: "",
            slug: "",
            brand: "",
            image: "",
            storeId: activeStoreId,
            categoryId: undefined,
            subcategoryId: undefined,
            variants: [
                {
                    variantName: "",
                    variantDescription: "",
                    slug: "",
                    sku: "",
                    weight: undefined,
                    price: undefined,
                    keywords: "",
                    sizes: [],
                    colors: [],
                    images: [],
                    specs: [],
                },
            ],
        },
    })

    const categoryId = form.watch("categoryId")
    const {data: subcategories} = useQuery(subCategoryOptions(categoryId))

    const {
        fields: variantFields,
        append: appendVariant,
        remove: removeVariant,
    } = useFieldArray({
        control: form.control,
        name: "variants",
    })

    const onSubmit = async (data: ProductFormData) => {
        startTransition(async () => {
            try {
                const response = await createProduct(data)
                if (response.success){
                    toast.success(response.message);
                    form.reset()
                }else {
                    toast.error(response.message)
                }
            }catch (error){
                console.error("Unexpected error", error)
                toast.error("Failed to create product. Please try again.")
            }
        })
    }

    const addNewVariant = () => {
        appendVariant({
            variantName: "",
            variantDescription: "",
            slug: "",
            sku: "",
            weight: 0,
            price: undefined,
            isSale: false,
            saleEndDate: undefined,
            keywords: "",
            sizes: [],
            colors: [],
            images: [],
            specs: [],
        })
    }

    return (
        <div className="max-w-5xl mx-auto p-2 sm:p-6 lg:p-8 space-y-6 sm:space-y-8">
            <div className="text-center space-y-4 pb-6 sm:pb-8">
                <h1 className="text-3xl sm:text-4xl font-bold text-balance">Create New Product</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                    Add your product details, variants, and specifications to create a comprehensive listing
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 sm:space-y-8">
                    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                        <CardHeader className="p-4 sm:p-6 pb-4 sm:pb-6">
                            <CardTitle className="flex items-center gap-3 text-xl">
                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                    <Info className="h-5 w-5 text-blue-600 dark:text-blue-400"/>
                                </div>
                                Basic Information
                            </CardTitle>
                            <p className="text-sm text-muted-foreground">Enter the core details about your product</p>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                                <div className="space-y-4 sm:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Product Name
                                                        *</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter product name"
                                                               className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="brand"
                                            render={({field}) => (
                                                <FormItem>
                                                    <FormLabel className="text-sm font-semibold">Brand</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter brand name"
                                                               className="h-11" {...field} />
                                                    </FormControl>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="slug"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">URL Slug</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="product-url-slug"
                                                           className="h-11 font-mono text-sm" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="categoryId"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Category *</FormLabel>
                                                <Select
                                                    onValueChange={(value) => {
                                                        field.onChange(Number(value))
                                                        form.setValue("subcategoryId", undefined)
                                                    }}
                                                    value={field.value ? String(field.value) : undefined}
                                                >
                                                    <SelectTrigger className="h-11 w-full">
                                                        <SelectValue placeholder="Select Category"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories?.map((category) => (
                                                            <SelectItem key={category.id} value={String(category.id)}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="subcategoryId"
                                        key={categoryId}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Subcategory</FormLabel>
                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    value={field.value ? String(field.value) : undefined}
                                                    disabled={!categoryId}
                                                >
                                                    <SelectTrigger className="h-11 w-full">
                                                        <SelectValue placeholder="Select Subcategory"/>
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {subcategories?.map((subCategory) => (
                                                            <SelectItem key={subCategory.id}
                                                                        value={String(subCategory.id)}>
                                                                {subCategory.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="image"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel className="text-sm font-semibold">Product Image</FormLabel>
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
                                                                className={`aspect-square bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 overflow-hidden group hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-300 cursor-pointer ${
                                                                    isDragging ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20" : ""
                                                                }`}
                                                                onClick={!previewUrl ? openFileDialog : undefined}
                                                            >
                                                                {isPending || isDeleting ? (
                                                                    <div
                                                                        className="h-full flex flex-col items-center justify-center">
                                                                        <LoaderIcon
                                                                            className="w-8 h-8 animate-spin text-blue-500 mb-3"/>
                                                                        <p className="text-sm font-medium text-foreground">
                                                                            {isPending ? "Uploading..." : "Removing..."}
                                                                        </p>
                                                                    </div>
                                                                ) : previewUrl ? (
                                                                    <div className="relative h-full group">
                                                                        <Image
                                                                            src={previewUrl || "/placeholder.svg"}
                                                                            alt="Product image"
                                                                            fill
                                                                            className="object-cover"
                                                                        />
                                                                        <div
                                                                            className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation()
                                                                                    openFileDialog()
                                                                                }}
                                                                                className="bg-white/90 backdrop-blur-sm rounded-lg p-3 hover:bg-white transition-colors shadow-lg"
                                                                            >
                                                                                <Camera
                                                                                    className="w-5 h-5 text-slate-700"/>
                                                                            </button>
                                                                        </div>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation()
                                                                                removeImage()
                                                                            }}
                                                                            className="bg-red-500/90 backdrop-blur-sm rounded-lg p-2 hover:bg-red-600 transition-colors absolute top-3 right-3 shadow-lg"
                                                                        >
                                                                            <XIcon className="w-4 h-4 text-white"/>
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <div
                                                                        className="h-full flex flex-col items-center justify-center p-6 text-center">
                                                                        <div
                                                                            className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-4 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300">
                                                                            <ImageIcon
                                                                                className="w-8 h-8 text-blue-600 dark:text-blue-400"/>
                                                                        </div>
                                                                        <p className="text-base font-semibold text-foreground mb-2">Upload
                                                                            Product Image</p>
                                                                        <p className="text-sm text-muted-foreground mb-1">Click
                                                                            or drag & drop</p>
                                                                        <p className="text-xs text-muted-foreground opacity-75">
                                                                            Square format recommended
                                                                        </p>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </SingleImageUpload>
                                                </FormControl>
                                                <FormMessage className="text-xs mt-2"/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="description"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold">Description *</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your product in detail..."
                                                className="min-h-[120px] resize-none"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-br from-background to-muted/20">
                        <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle className="flex items-center gap-3 text-xl">
                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                            <Package className="h-5 w-5 text-green-600 dark:text-green-400"/>
                                        </div>
                                        Product Variants
                                        <Badge variant="secondary" className="ml-2">
                                            {variantFields.length}
                                        </Badge>
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Configure different versions of
                                        your product</p>
                                </div>
                                <Button
                                    type="button"
                                    onClick={addNewVariant}
                                    className="shadow-lg"
                                >
                                    <Plus className="h-4 w-4 mr-2"/>
                                    Add Variant
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                            {variantFields.map((variant, variantIndex) => (
                                <VariantForm
                                    key={variant.id}
                                    variantIndex={variantIndex}
                                    form={form}
                                    onRemove={() => removeVariant(variantIndex)}
                                    canRemove={variantFields.length > 1}
                                />
                            ))}
                        </CardContent>
                    </Card>

                    <div className="flex justify-center pt-6 sm:pt-8">
                        <Button
                            type="submit"
                            className="w-full sm:w-auto min-w-[200px] h-12  font-semibold shadow-lg text-lg"
                            disabled={isPending}
                        >
                            {isPending ? (
                                <>
                                    <LoaderIcon className="w-5 h-5 mr-2 animate-spin"/>
                                    Creating Product...
                                </>
                            ) : (
                                <>
                                    <Package className="w-5 h-5 mr-2"/>
                                    Create Product
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}

function VariantForm({
                         variantIndex,
                         form,
                         onRemove,
                         canRemove,
                     }: {
    variantIndex: number
    form: any
    onRemove: () => void
    canRemove: boolean
}) {
    const {
        fields: sizeFields,
        append: appendSize,
        remove: removeSize,
    } = useFieldArray({
        control: form.control,
        name: `variants.${variantIndex}.sizes`,
    })

    const {
        fields: colorFields,
        append: appendColor,
        remove: removeColor,
    } = useFieldArray({
        control: form.control,
        name: `variants.${variantIndex}.colors`,
    })

    const {} = useFieldArray({
        control: form.control,
        name: `variants.${variantIndex}.images`,
    })

    const {
        fields: specFields,
        append: appendSpec,
        remove: removeSpec,
    } = useFieldArray({
        control: form.control,
        name: `variants.${variantIndex}.specs`,
    })

    return (
        <Card className="border-2 border-dashed border-muted-foreground/20 bg-gradient-to-br from-muted/30 to-muted/10">
            <CardHeader className="p-4 sm:p-6 pb-3 sm:pb-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            {variantIndex + 1}
                        </div>
                        <CardTitle className="text-lg">Variant {variantIndex + 1}</CardTitle>
                    </div>
                    {canRemove && (
                        <Button type="button" variant="destructive" size="sm" onClick={onRemove}>
                            <Trash2 className="h-4 w-4"/>
                        </Button>
                    )}
                </div>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 space-y-4 sm:space-y-6">
                <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.variantName`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Variant Name *</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Premium Edition" className="h-11" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.sku`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">SKU</FormLabel>
                                    <FormControl>
                                        <Input placeholder="PROD-VAR-001"
                                               className="h-11 font-mono text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={`variants.${variantIndex}.variantDescription`}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Variant Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe this variant..."
                                              className="min-h-[100px] resize-none" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.slug`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Slug</FormLabel>
                                    <FormControl>
                                        <Input placeholder="variant-slug"
                                               className="h-11 font-mono text-sm" {...field} />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.weight`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Weight (kg)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="0.5"
                                            className="h-11"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.price`}
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="text-sm font-semibold">Base Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            step="0.01"
                                            placeholder="99.99"
                                            className="h-11"
                                            value={field.value || ""}
                                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                                        />
                                    </FormControl>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />
                    </div>

                    <FormField
                        control={form.control}
                        name={`variants.${variantIndex}.keywords`}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className="text-sm font-semibold">Keywords</FormLabel>
                                <FormControl>
                                    <Input placeholder="keyword1, keyword2, keyword3" className="h-11" {...field} />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <Separator className="my-4 sm:my-6"/>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-green-100 dark:bg-green-900/30 rounded-md">
                                <ImageIcon className="h-4 w-4 text-green-600 dark:text-green-400"/>
                            </div>
                            <h4 className="font-semibold">Variant Images</h4>
                        </div>
                    </div>

                    <FormField
                        control={form.control}
                        name={`variants.${variantIndex}.images`}
                        render={({field}) => (
                            <FormItem>
                                <FormControl>
                                    <CloudinaryImageGrid
                                        value={field.value?.map((img: any) => img.imageUrl) || []}
                                        onChange={(urls) => {
                                            const imageObjects = urls.map((url, index) => ({
                                                imageUrl: url,
                                                altText: `Variant ${variantIndex + 1} image ${index + 1}`,
                                            }))
                                            field.onChange(imageObjects)
                                        }}
                                        folder={`products/variants`}
                                        maxFiles={6}
                                        maxSizeMB={2}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <Separator/>

                {/* Colors */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-900/30 rounded-md">
                                <Palette className="h-4 w-4 text-purple-600 dark:text-purple-400"/>
                            </div>
                            <h4 className="font-semibold">Colors</h4>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 bg-transparent"
                            onClick={() => appendColor({name: "", hexCode: "#ffffff"})}
                        >
                            <Plus className="h-4 w-4 mr-1"/>
                            Add Color
                        </Button>
                    </div>

                    {colorFields.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-3">
                            {colorFields.map((color, colorIndex) => (
                                <div key={color.id} className="flex gap-3 items-start">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.colors.${colorIndex}.name`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input
                                                        placeholder="Color name (e.g., Red)"
                                                        className="h-9"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.colors.${colorIndex}.hexCode`}
                                        render={({field}) => (
                                            <FormItem className="w-32">
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <Input
                                                                placeholder="#FF0000"
                                                                className="h-9 font-mono text-sm pr-10"
                                                                {...field}
                                                                value={field.value || ""}
                                                            />

                                                            {/* Color Picker Popover */}
                                                            <Popover>
                                                                <PopoverTrigger asChild>
                                                                    <button
                                                                        type="button"
                                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-600 cursor-pointer hover:scale-110 transition-transform"
                                                                        style={{backgroundColor: field.value || "#ffffff"}}
                                                                    />
                                                                </PopoverTrigger>
                                                                <PopoverContent className="w-auto p-3" side="top">
                                                                    <div className="space-y-3">
                                                                        <HexColorPicker
                                                                            color={field.value || "#ffffff"}
                                                                            onChange={field.onChange}
                                                                        />
                                                                        <div className="flex items-center gap-2">
                                                                            <Input
                                                                                value={field.value || ""}
                                                                                onChange={(e) => field.onChange(e.target.value)}
                                                                                className="h-8 text-xs w-32 font-mono flex-1"
                                                                                placeholder="#000000"
                                                                            />
                                                                            <Button
                                                                                type="button"
                                                                                variant="outline"
                                                                                size="sm"
                                                                                className="h-8 px-2"
                                                                                onClick={async () => {
                                                                                    if ('EyeDropper' in window) {
                                                                                        try {
                                                                                            const eyeDropper = new (window as any).EyeDropper()
                                                                                            const result = await eyeDropper.open()
                                                                                            field.onChange(result.sRGBHex)
                                                                                        } catch (e) {
                                                                                            console.log('User cancelled eyedropper')
                                                                                        }
                                                                                    } else {
                                                                                        alert('EyeDropper API is not supported in this browser')
                                                                                    }
                                                                                }}
                                                                            >
                                                                                <Pipette className="h-3 w-3"/>
                                                                            </Button>
                                                                        </div>
                                                                    </div>
                                                                </PopoverContent>
                                                            </Popover>
                                                        </div>
                                                    </div>
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />

                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="h-9"
                                        onClick={() => removeColor(colorIndex)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>


                <Separator/>

                {/* Sizes */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-blue-100 dark:bg-blue-900/30 rounded-md">
                                <Ruler className="h-4 w-4 text-blue-600 dark:text-blue-400"/>
                            </div>
                            <h4 className="font-semibold">Sizes & Inventory</h4>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendSize({size: "", quantity: 0, price: 0, discount: 0})}
                            className="h-9"
                        >
                            <Plus className="h-4 w-4 mr-1"/>
                            Add Size
                        </Button>
                    </div>

                    {sizeFields.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-3">
                            <div className="grid grid-cols-5 gap-2 text-xs font-medium text-muted-foreground mb-2">
                                <div>Size</div>
                                <div>Qty</div>
                                <div>Price</div>
                                <div>Discount</div>
                                <div></div>
                            </div>
                            {sizeFields.map((size, sizeIndex) => (
                                <div key={size.id} className="grid grid-cols-5 gap-2 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.sizes.${sizeIndex}.size`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="US 9" className="h-9" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.sizes.${sizeIndex}.quantity`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="10"
                                                        className="h-9"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.sizes.${sizeIndex}.price`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        step="0.01"
                                                        placeholder="99.99"
                                                        className="h-9"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.sizes.${sizeIndex}.discount`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="0"
                                                        className="h-9"
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : 0)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="h-9"
                                        onClick={() => removeSize(sizeIndex)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator/>

                {/* Specs */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div className="p-1.5 bg-orange-100 dark:bg-orange-900/30 rounded-md">
                                <FileText className="h-4 w-4 text-orange-600 dark:text-orange-400"/>
                            </div>
                            <h4 className="font-semibold">Specifications</h4>
                        </div>
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="h-9 bg-transparent"
                            onClick={() => appendSpec({name: "", value: ""})}
                        >
                            <Plus className="h-4 w-4 mr-1"/>
                            Add Spec
                        </Button>
                    </div>

                    {specFields.length > 0 && (
                        <div className="bg-muted/30 rounded-lg p-3 sm:p-4 space-y-3">
                            {specFields.map((spec, specIndex) => (
                                <div key={spec.id} className="flex gap-3 items-end">
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.specs.${specIndex}.name`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Specification name (e.g., Material)"
                                                           className="h-9" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`variants.${variantIndex}.specs.${specIndex}.value`}
                                        render={({field}) => (
                                            <FormItem className="flex-1">
                                                <FormControl>
                                                    <Input placeholder="Specification value (e.g., Cotton blend)"
                                                           className="h-9" {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="sm"
                                        className="h-9"
                                        onClick={() => removeSpec(specIndex)}
                                    >
                                        <Trash2 className="h-4 w-4"/>
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
