"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {useRouter} from "next/navigation"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {Badge} from "@/components/ui/badge"
import {Separator} from "@/components/ui/separator"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription} from "@/components/ui/form"
import {Truck, Clock, DollarSign, Package, RotateCcw, Weight, Plus, Timer, Save, ArrowLeft} from "lucide-react"
import {ShippingDetails, updateStoreShippingDetails} from "@/actions/store/storeShippingDetails";
import {ShippingDetailsFormData, shippingDetailsSchema} from "@/zodSchema/store";
import {useTransition} from "react";
import {toast} from "sonner";


interface ShippingDetailsEditFormProps {
    shippingDetails: ShippingDetails | null
    slug: string
}

export default function ShippingDetailsEditForm({shippingDetails, slug}: ShippingDetailsEditFormProps) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()

    const form = useForm<ShippingDetailsFormData>({
        resolver: zodResolver(shippingDetailsSchema),
        defaultValues: {
            returnPolicy: shippingDetails?.returnPolicy || "",
            defaultShippingService: shippingDetails?.defaultShippingService || "",
            defaultShippingCost: shippingDetails?.defaultShippingCost || "",
            defaultShippingCostPerItem: shippingDetails?.defaultShippingCostPerItem || "",
            defaultShippingCostAdditionalItem: shippingDetails?.defaultShippingCostAdditionalItem || "",
            defaultShippingCostPerKg: shippingDetails?.defaultShippingCostPerKg || "",
            defaultShippingCostFixed: shippingDetails?.defaultShippingCostFixed || "",
            minimumDeliveryTime: shippingDetails?.minimumDeliveryTime || null,
            maximumDeliveryTime: shippingDetails?.maximumDeliveryTime || null,
        },
    })

    const onSubmit = async (data: ShippingDetailsFormData) => {
        startTransition(async () => {
            try {
                const response = await updateStoreShippingDetails(slug, data)
                if (response.success) {
                    toast.success(response.message)
                    router.push(`/dashboard/seller/stores/${slug}/shipping/`)
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                console.error("Failed to update shipping details:", error)
                toast.error("An unexpected error occurred. Please try again.")
            }
        })
    }

    const handleCancel = async () => {
        router.back()
    }

    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="sm" onClick={handleCancel}>
                            <ArrowLeft className="h-4 w-4"/>
                        </Button>
                        <h1 className="text-3xl font-bold tracking-tight">Edit Shipping Details</h1>
                    </div>
                    <p className="text-muted-foreground">Update your store's shipping information and policies</p>
                </div>
                <Badge variant="secondary">Draft</Badge>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {/* Return Policy Section */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <RotateCcw className="h-5 w-5"/>
                                Return Policy
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="returnPolicy"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Return Policy Description</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your return policy, including time limits, conditions, and who pays for return shipping..."
                                                rows={4}
                                                className="resize-none"
                                                {...field}
                                                value={field.value || ""}
                                            />
                                        </FormControl>
                                        <FormDescription>Clearly explain your return policy to build customer
                                            trust</FormDescription>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    {/* Shipping Service & Delivery Times */}
                    <div className="grid md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Truck className="h-5 w-5"/>
                                    Shipping Service
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <FormField
                                    control={form.control}
                                    name="defaultShippingService"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel>Default Shipping Service</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g., Standard Shipping, Express Delivery"
                                                    {...field}
                                                    value={field.value || ""}
                                                />
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="pb-4">
                                <CardTitle className="flex items-center gap-2">
                                    <Clock className="h-5 w-5"/>
                                    Delivery Times
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="minimumDeliveryTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Minimum Days</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="3"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="maximumDeliveryTime"
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>Maximum Days</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min="1"
                                                        placeholder="7"
                                                        {...field}
                                                        value={field.value || ""}
                                                        onChange={(e) => field.onChange(e.target.value ? Number.parseInt(e.target.value) : null)}
                                                    />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Shipping Costs */}
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5"/>
                                Shipping Costs
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField
                                    control={form.control}
                                    name="defaultShippingCost"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground"/>
                                                Default Cost
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="$5.99" {...field} value={field.value || ""}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultShippingCostPerItem"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Package className="h-4 w-4 text-muted-foreground"/>
                                                Per Item
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="$2.50" {...field} value={field.value || ""}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultShippingCostAdditionalItem"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Plus className="h-4 w-4 text-muted-foreground"/>
                                                Additional Items
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="$1.50" {...field} value={field.value || ""}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultShippingCostPerKg"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Weight className="h-4 w-4 text-muted-foreground"/>
                                                Per Kg
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="$3.00" {...field} value={field.value || ""}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="defaultShippingCostFixed"
                                    render={({field}) => (
                                        <FormItem>
                                            <FormLabel className="flex items-center gap-2">
                                                <Timer className="h-4 w-4 text-muted-foreground"/>
                                                Fixed Cost
                                            </FormLabel>
                                            <FormControl>
                                                <Input placeholder="$4.99" {...field} value={field.value || ""}/>
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Separator/>

                    <div className="flex items-center justify-end gap-4">
                        <Button type="button" variant="outline" onClick={handleCancel}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isPending}>
                            <Save className="h-4 w-4 mr-2"/>
                            {isPending ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    )
}
