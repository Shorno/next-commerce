"use client"

import { useStoreForm } from "@/store/storeFormStore"
import { Card, CardContent } from "@/components/ui/card"
import { Eye } from "lucide-react"
import Image from "next/image"

export default function StoreReviewForm() {
    const { data } = useStoreForm();

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center mb-8">
                <h3 className="text-lg font-semibold mb-2">Review Your Store Information</h3>
                <p className="text-muted-foreground">
                    Please review all information before submitting your store for approval
                </p>
            </div>

            <Card className={"p-0"}>
                <CardContent className="p-0">
                    {/* Cover Image Section */}
                    <div className="relative">
                        {/* Cover Image */}
                        {data?.cover ? (
                            <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
                                <Image
                                    src={data.cover}
                                    alt="Store cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-48 bg-gradient-to-br from-primary/5 to-primary/10 rounded-t-lg flex items-center justify-center">
                                <p className="text-muted-foreground">No cover image</p>
                            </div>
                        )}

                        <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            {data?.logo ? (
                                <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-background shadow-lg">
                                    <Image
                                        src={data.logo}
                                        alt="Store logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-primary/10 to-primary/20 border-4 border-background shadow-lg flex items-center justify-center">
                                    <p className="text-sm text-muted-foreground text-center">No logo</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="pt-24 p-6">
                        <h4 className="font-semibold mb-6 flex items-center justify-center gap-2">
                            <Eye className="w-5 h-5 text-primary" />
                            Store Information Summary
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {/* Store Name */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Store Name</span>
                                <p className="font-medium">{data?.name || "Not provided"}</p>
                            </div>

                            {/* URL Slug */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">URL Slug</span>
                                <p className="font-medium font-mono text-sm">{data?.slug || "Not provided"}</p>
                            </div>

                            {/* Email */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Email</span>
                                <p className="font-medium">{data?.email || "Not provided"}</p>
                            </div>

                            {/* Phone */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Phone</span>
                                <p className="font-medium">{data?.phone || "Not provided"}</p>
                            </div>

                            {/* Shipping Service */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Shipping Service</span>
                                <p className="text-sm">{data?.defaultShippingService || "Not provided"}</p>
                            </div>

                            {/* Shipping Cost */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Shipping Cost</span>
                                <p className="text-sm">{data?.defaultShippingCost ? `$${data.defaultShippingCost}` : "Not provided"}</p>
                            </div>

                            {/* Delivery Time Range */}
                            <div className="space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Delivery Time</span>
                                <p className="text-sm">
                                    {data?.minimumDeliveryTime !== undefined && data?.maximumDeliveryTime !== undefined
                                        ? `${data.minimumDeliveryTime}-${data.maximumDeliveryTime} days`
                                        : "Not provided"
                                    }
                                </p>
                            </div>

                            {/* Description - Full Width */}
                            <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                <span className="text-sm font-medium text-muted-foreground">Description</span>
                                <p className="text-sm leading-relaxed">{data?.description || "Not provided"}</p>
                            </div>

                            {/* Return Policy - Full Width */}
                            {data?.returnPolicy && (
                                <div className="md:col-span-2 lg:col-span-3 space-y-2">
                                    <span className="text-sm font-medium text-muted-foreground">Return Policy</span>
                                    <p className="text-sm leading-relaxed">{data.returnPolicy}</p>
                                </div>
                            )}
                        </div>

                        {/* Ready to Submit Section */}
                        <div className="mt-8 pt-6 border-t border-border">
                            <div className="text-center space-y-2">
                                <h4 className="font-semibold text-primary">Ready to Submit?</h4>
                                <p className="text-sm text-muted-foreground">
                                    Once submitted, your store will be reviewed and activated within 24-48 hours.
                                    You can still edit these details later from your dashboard.
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
