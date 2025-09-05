"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Clock, AlertCircle, CheckCircle2, Info, Edit } from "lucide-react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Store } from "@/db/schema"

export default function PendingStoreApplication({ data }: { data?: Store }) {
    if (!data) {
        return (
            <div className="max-w-3xl mx-auto space-y-4">
                <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                        <Clock className="w-5 h-5 text-muted-foreground animate-pulse" />
                        <Badge variant="outline" className="text-xs">
                            Loading...
                        </Badge>
                    </div>
                    <h2 className="text-xl font-semibold mb-1">Loading Store Information</h2>
                    <p className="text-sm text-muted-foreground">
                        Please wait while we fetch your store details...
                    </p>
                </div>

                <Card>
                    <CardContent className="p-6">
                        <div className="space-y-4">
                            <div className="animate-pulse">
                                <div className="h-32 bg-muted rounded mb-4"></div>
                                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                                <div className="h-4 bg-muted rounded w-1/2"></div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto space-y-4">
            <div className="text-center mb-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <Badge variant="outline" className="text-xs">
                        Under Review
                    </Badge>
                </div>
                <h2 className="text-xl font-semibold mb-1">Store Application Submitted</h2>
                <p className="text-sm text-muted-foreground">
                    Your application is being reviewed. You&apos;ll be notified within 24-48 hours.
                </p>
            </div>

            <Alert className="py-2">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-sm">
                    <strong>Review in Progress:</strong> Application submitted successfully and under review.
                </AlertDescription>
            </Alert>

            <div className="flex justify-center">
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Edit className="w-4 h-4" />
                    Update Application
                </Button>
            </div>

            <Card className="py-0">
                <CardContent className="p-0">
                    <div className="relative">
                        {data.cover ? (
                            <div className="relative w-full h-32 overflow-hidden rounded-t-lg">
                                <Image
                                    src={data.cover || "/placeholder.svg"}
                                    alt="Store cover"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-full h-32 bg-muted rounded-t-lg flex items-center justify-center">
                                <p className="text-sm text-muted-foreground">No cover image</p>
                            </div>
                        )}

                        <div className="absolute left-6 -bottom-8">
                            {data.logo ? (
                                <div className="relative w-16 h-16 rounded-lg overflow-hidden border-2 border-background shadow-sm">
                                    <Image
                                        src={data.logo || "/placeholder.svg"}
                                        alt="Store logo"
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="w-16 h-16 rounded-lg bg-muted border-2 border-background shadow-sm flex items-center justify-center">
                                    <p className="text-xs text-muted-foreground">Logo</p>
                                </div>
                            )}
                        </div>

                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="text-xs">
                                <Clock className="w-3 h-3 mr-1" />
                                Pending
                            </Badge>
                        </div>
                    </div>

                    <div className="pt-12 p-6">
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold mb-1">{data.name || "Store Name Not Provided"}</h3>
                            {data.slug && (
                                <p className="text-xs text-muted-foreground font-mono">
                                    next-commerce/{data.slug}
                                </p>
                            )}
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-3">
                                <Info className="w-4 h-4" />
                                <h4 className="font-medium">Application Details</h4>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-3">
                                    <h5 className="text-sm font-medium border-b pb-1">Contact</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Email:</span>
                                            <span>{data.email || "Not provided"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Phone:</span>
                                            <span>{data.phone || "Not provided"}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <h5 className="text-sm font-medium border-b pb-1">Shipping</h5>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Service:</span>
                                            <span>{data.defaultShippingService || "Not provided"}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Cost:</span>
                                            <span>
                                                {data.defaultShippingCost ? `$${data.defaultShippingCost}` : "Not provided"}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Delivery:</span>
                                            <span>
                                                {data.minimumDeliveryTime !== undefined && data.maximumDeliveryTime !== undefined
                                                    ? `${data.minimumDeliveryTime}-${data.maximumDeliveryTime} days`
                                                    : "Not provided"
                                                }
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {data.description && (
                                <div className="space-y-2">
                                    <h5 className="text-sm font-medium border-b pb-1">Description</h5>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                        {data.description}
                                    </p>
                                </div>
                            )}

                            {data.returnPolicy && (
                                <div className="space-y-2">
                                    <h5 className="text-sm font-medium border-b pb-1">Return Policy</h5>
                                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded">
                                        {data.returnPolicy}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <div className="bg-muted/50 rounded p-4">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                    <div>
                                        <h4 className="font-medium text-sm mb-2">Next Steps</h4>
                                        <ul className="text-xs text-muted-foreground space-y-1">
                                            <li>• Review and verification in progress</li>
                                            <li>• Email notification upon approval</li>
                                            <li>• Access to store dashboard after approval</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <p className="text-xs text-muted-foreground text-center mt-3">
                                Questions? Contact support@yoursite.com
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
