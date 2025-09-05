"use client"

import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription} from "@/components/ui/form"
import {StorePolicyFormData, storePolicySchema} from "@/zodSchema/store"
import {Input} from "@/components/ui/input"
import {useStoreForm} from "@/store/storeFormStore"
import {Textarea} from "@/components/ui/textarea"
import {useEffect, useState} from "react"
import {Truck, Clock, Shield} from "lucide-react"

export default function StorePolicyForm() {
    const {data, setFormData} = useStoreForm()
    const [isHydrated, setIsHydrated] = useState(false)

    const form = useForm<StorePolicyFormData>({
        resolver: zodResolver(storePolicySchema),
        mode: "onChange",
        defaultValues: {
            defaultShippingService: data?.defaultShippingService || "",
            defaultShippingCost: data?.defaultShippingCost || "0",
            minimumDeliveryTime: data?.minimumDeliveryTime || 0,
            maximumDeliveryTime: data?.maximumDeliveryTime || 0,
            returnPolicy: data?.returnPolicy || "",
        },
    })

    useEffect(() => {
        setIsHydrated(true)
        form.reset({
            defaultShippingService: data?.defaultShippingService || "",
            defaultShippingCost: data?.defaultShippingCost || "0",
            minimumDeliveryTime: data?.minimumDeliveryTime || 0,
            maximumDeliveryTime: data?.maximumDeliveryTime || 0,
            returnPolicy: data?.returnPolicy || "",
        })
    }, [data, form])

    if (!isHydrated) {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="bg-card rounded-2xl border border-border/50 p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-4 bg-muted rounded w-1/3"></div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-12 bg-muted rounded"></div>
                            <div className="h-12 bg-muted rounded"></div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="h-12 bg-muted rounded"></div>
                            <div className="h-12 bg-muted rounded"></div>
                        </div>
                        <div className="h-32 bg-muted rounded"></div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto">
            <Form {...form}>
                <form className="space-y-0" onChange={() => setFormData(form.getValues())}>
                    <div className="bg-card rounded-2xl border border-border/50 p-8 space-y-8">
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
                                            <FormLabel className="text-sm font-semibold text-foreground">
                                                Shipping Cost
                                            </FormLabel>
                                            <FormControl>
                                                <div className="relative">
                                                    <span
                                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground text-base font-medium">$</span>
                                                    <Input
                                                        type="text"
                                                        placeholder="0.00"
                                                        {...field}
                                                        className="h-12 text-base pl-10 bg-background/70 border-border/50 focus:border-primary/50 transition-all duration-200"
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
                        <div
                            className="bg-gradient-to-br from-background to-muted/20 rounded-2xl border border-border/50 p-6 space-y-6">
                            <div className="flex items-center space-x-3">
                                <div
                                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center">
                                    <Shield className="w-5 h-5 text-white"/>
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-foreground">Return Policy</h3>
                                    <p className="text-sm text-muted-foreground">Set your return and refund terms</p>
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name="returnPolicy"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel className="text-sm font-semibold text-foreground">
                                            Return Policy Details
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Describe your return and refund policy. For example: '30-day return policy for unused items in original packaging...'"
                                                className="min-h-[120px] resize-none text-base bg-background/70 border-border/50 focus:border-primary/50 focus:bg-background transition-all duration-200"
                                                {...field}
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
                </form>
            </Form>
        </div>
    )
}