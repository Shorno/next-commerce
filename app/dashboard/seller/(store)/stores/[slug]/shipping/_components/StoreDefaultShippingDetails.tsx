import {Badge} from "@/components/ui/badge";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Clock, DollarSign, Edit, Package, Plus, RotateCcw, Timer, Truck, Weight} from "lucide-react";
import {getStoreShippingDetails} from "@/actions/store/storeShippingDetails";
import {Button} from "@/components/ui/button";
import Link from "next/link";

interface ShippingDetailsProps {
    slug: string;
}


export default async function StoreDefaultShippingDetails({slug}: ShippingDetailsProps) {
    const shippingDetails = await getStoreShippingDetails(slug)

    if (!shippingDetails) {
        return (
            <div className="container mx-auto p-6">
                <Card className="border-destructive/50">
                    <CardContent className="flex items-center justify-center py-12">
                        <div className="text-center space-y-2">
                            <Package className="h-12 w-12 mx-auto text-muted-foreground"/>
                            <h3 className="text-lg font-semibold">No Shipping Details Found</h3>
                            <p className="text-muted-foreground">No shipping details found for this store.</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }


    const formatValue = (value: string | number | null | undefined, suffix = "") => {
        if (value === null || value === undefined || value === "") {
            return (
                <Badge variant="secondary" className="text-xs">
                    Not specified
                </Badge>
            )
        }
        return (
            <span className="font-medium">
        {value}
                {suffix}
      </span>
        )
    }
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Shipping Details</h1>
                    <p className="text-muted-foreground">Comprehensive shipping information and policies for this
                        store</p>
                </div>
                {/* Edit Button */}
                <Button asChild>
                    <Link href={`/dashboard/seller/stores/${slug}/shipping/edit`} className="flex items-center gap-2">
                        <Edit className="h-4 w-4"/>
                        Edit Details
                    </Link>
                </Button>
            </div>

            {/* Main Content */}
            <div className="grid gap-6">
                {/* Return Policy Section */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <RotateCcw className="h-5 w-5"/>
                            Return Policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            {shippingDetails.returnPolicy ? (
                                <p className="text-sm leading-relaxed">{shippingDetails.returnPolicy}</p>
                            ) : (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Badge variant="secondary">Not specified</Badge>
                                    <span className="text-sm">No return policy has been set</span>
                                </div>
                            )}
                        </div>
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
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Default Service</label>
                                    <div className="mt-1">{formatValue(shippingDetails.defaultShippingService)}</div>
                                </div>
                            </div>
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
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Minimum</label>
                                        <div
                                            className="mt-1">{formatValue(shippingDetails.minimumDeliveryTime, " days")}</div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Maximum</label>
                                        <div
                                            className="mt-1">{formatValue(shippingDetails.maximumDeliveryTime, " days")}</div>
                                    </div>
                                </div>
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
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground"/>
                                    <label className="text-sm font-medium text-muted-foreground">Default Cost</label>
                                </div>
                                <div className="pl-6">{formatValue(shippingDetails.defaultShippingCost)}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground"/>
                                    <label className="text-sm font-medium text-muted-foreground">Per Item</label>
                                </div>
                                <div className="pl-6">{formatValue(shippingDetails.defaultShippingCostPerItem)}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-muted-foreground"/>
                                    <label className="text-sm font-medium text-muted-foreground">Additional
                                        Items</label>
                                </div>
                                <div
                                    className="pl-6">{formatValue(shippingDetails.defaultShippingCostAdditionalItem)}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Weight className="h-4 w-4 text-muted-foreground"/>
                                    <label className="text-sm font-medium text-muted-foreground">Per Kg</label>
                                </div>
                                <div className="pl-6">{formatValue(shippingDetails.defaultShippingCostPerKg)}</div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Timer className="h-4 w-4 text-muted-foreground"/>
                                    <label className="text-sm font-medium text-muted-foreground">Fixed Cost</label>
                                </div>
                                <div className="pl-6">{formatValue(shippingDetails.defaultShippingCostFixed)}</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
