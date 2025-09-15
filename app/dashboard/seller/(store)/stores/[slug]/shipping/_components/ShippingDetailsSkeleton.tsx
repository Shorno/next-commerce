import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, DollarSign, Package, Plus, RotateCcw, Timer, Truck, Weight } from "lucide-react";

export default function StoreShippingDetailsSkeleton() {
    return (
        <div className="container mx-auto p-6 space-y-6">
            {/* Header Skeleton */}
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <Skeleton className="h-9 w-48" /> {/* Title */}
                    <Skeleton className="h-5 w-64" /> {/* Description */}
                </div>
                {/* Edit Button Skeleton */}
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Main Content Skeletons */}
            <div className="grid gap-6">
                {/* Return Policy Section Skeleton */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2 text-xl">
                            <RotateCcw className="h-5 w-5" />
                            Return Policy
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                            <Skeleton className="h-20 w-full" /> {/* Policy text */}
                        </div>
                    </CardContent>
                </Card>

                {/* Shipping Service & Delivery Times Skeletons */}
                <div className="grid md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Truck className="h-5 w-5" />
                                Shipping Service
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-muted-foreground">Default Service</label>
                                    <div className="mt-1">
                                        <Skeleton className="h-6 w-32" />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-4">
                            <CardTitle className="flex items-center gap-2">
                                <Clock className="h-5 w-5" />
                                Delivery Times
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Minimum</label>
                                        <div className="mt-1">
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-sm font-medium text-muted-foreground">Maximum</label>
                                        <div className="mt-1">
                                            <Skeleton className="h-6 w-20" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Shipping Costs Skeleton */}
                <Card>
                    <CardHeader className="pb-4">
                        <CardTitle className="flex items-center gap-2">
                            <DollarSign className="h-5 w-5" />
                            Shipping Costs
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <label className="text-sm font-medium text-muted-foreground">Default Cost</label>
                                </div>
                                <div className="pl-6">
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Package className="h-4 w-4 text-muted-foreground" />
                                    <label className="text-sm font-medium text-muted-foreground">Per Item</label>
                                </div>
                                <div className="pl-6">
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Plus className="h-4 w-4 text-muted-foreground" />
                                    <label className="text-sm font-medium text-muted-foreground">Additional Items</label>
                                </div>
                                <div className="pl-6">
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Weight className="h-4 w-4 text-muted-foreground" />
                                    <label className="text-sm font-medium text-muted-foreground">Per Kg</label>
                                </div>
                                <div className="pl-6">
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center gap-2">
                                    <Timer className="h-4 w-4 text-muted-foreground" />
                                    <label className="text-sm font-medium text-muted-foreground">Fixed Cost</label>
                                </div>
                                <div className="pl-6">
                                    <Skeleton className="h-6 w-24" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
