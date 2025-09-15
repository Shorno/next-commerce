"use client"

import {useTransition} from "react"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {LoaderIcon, SaveIcon} from "lucide-react"
import {toast} from "sonner"
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form"
import {CountryWithShippingRate, upsertShippingRate} from "@/actions/store/storeShippingDetails"
import {ShippingRateFormData, shippingRateSchema} from "@/zodSchema/shippingRate"
import {useParams} from "next/navigation";

interface ShippingRateFormProps {
    shippingRate: CountryWithShippingRate
    onSuccess: () => void
    onCancel: () => void
}

export function ShippingRateForm({shippingRate, onSuccess, onCancel}: ShippingRateFormProps) {
    const [isPending, startTransition] = useTransition()
    const params = useParams();
    const slug = params.slug as string

    const form = useForm<ShippingRateFormData>({
        resolver: zodResolver(shippingRateSchema),
        defaultValues: {
            shippingService: shippingRate.shippingRate?.shippingService || "",
            shippingCostPerItem: shippingRate.shippingRate?.shippingCostPerItem || "",
            shippingCostAdditionalItem: shippingRate.shippingRate?.shippingCostAdditionalItem || "",
            shippingCostPerKg: shippingRate.shippingRate?.shippingCostPerKg || "",
            shippingCostFixed: shippingRate.shippingRate?.shippingCostFixed || "",
            minimumDeliveryTime: shippingRate.shippingRate?.minimumDeliveryTime?.toString() || "",
            maximumDeliveryTime: shippingRate.shippingRate?.maximumDeliveryTime?.toString() || "",
            returnPolicy: shippingRate.shippingRate?.returnPolicy || "",
        },
    })

    function onSubmit(values: ShippingRateFormData) {
        startTransition(async () => {
            try {
                const response = await upsertShippingRate(slug, shippingRate.countryId, values)
                if (response.success) {
                    toast.success(response.message)
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
                <FormField
                    control={form.control}
                    name="shippingService"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Shipping Service</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., Express Delivery" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="shippingCostPerItem"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Cost / Item</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0.00"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shippingCostAdditionalItem"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Cost / Additional Item</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0.00"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="shippingCostPerKg"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Cost / Kg</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0.00"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="shippingCostFixed"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Fixed Cost</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="0.00"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        step="0.01"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="minimumDeliveryTime"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Min Days</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="2"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maximumDeliveryTime"
                        render={({field: {value, onChange, ...field}}) => (
                            <FormItem>
                                <FormLabel>Max Days</FormLabel>
                                <FormControl>
                                    <Input
                                        placeholder="7"
                                        {...field}
                                        value={value ?? ""}
                                        onChange={(e) => onChange(e.target.value === "" ? null : e.target.value)}
                                        disabled={isPending}
                                        type="number"
                                        min="0"
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="returnPolicy"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Return Policy</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g., 30 days return" {...field} disabled={isPending}/>
                            </FormControl>
                            <FormMessage/>
                        </FormItem>
                    )}
                />

                <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isPending}>
                        Cancel
                    </Button>
                    <Button type="submit" className="min-w-[120px]" disabled={isPending}>
                        {isPending ? (
                            <div className="flex items-center space-x-2">
                                <LoaderIcon className="w-4 h-4 animate-spin"/>
                                <span>Saving...</span>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <SaveIcon className="w-4 h-4"/>
                                <span>Save Changes</span>
                            </div>
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}