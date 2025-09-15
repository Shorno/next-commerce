"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import type { CountryWithShippingRate } from "@/actions/store/storeShippingDetails"
import {ShippingRateModal} from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateModal";

interface ShippingRateActionsCellProps {
    shippingRate: CountryWithShippingRate
}

export function ShippingRateActionsCell({ shippingRate}: ShippingRateActionsCellProps) {
    const [isEditOpen, setEditOpen] = useState(false)

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => setEditOpen(true)}
            >
                <Edit className="h-4 w-4" />
            </Button>

            <ShippingRateModal
                mode="edit"
                shippingRate={shippingRate}
                open={isEditOpen}
                onOpenChange={setEditOpen}
            />
        </>
    )
}
