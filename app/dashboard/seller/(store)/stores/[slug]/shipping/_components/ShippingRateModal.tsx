"use client"

import type React from "react"
import { BaseModal } from "@/components/base-modal"
import type { CountryWithShippingRate } from "@/actions/store/storeShippingDetails"
import {ShippingRateForm} from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateForm";

interface ShippingRateModalProps {
    mode: "edit" | "create"
    shippingRate: CountryWithShippingRate
    open: boolean
    onOpenChange: (open: boolean) => void
    trigger?: React.ReactNode
}

export function ShippingRateModal({ mode, shippingRate, open, onOpenChange, trigger }: ShippingRateModalProps) {
    const isEdit = mode === "edit"

    const handleSuccess = () => {
        onOpenChange(false)
    }

    return (
        <BaseModal
            variant="dialog"
            open={open}
            onOpenChange={onOpenChange}
            title={isEdit ? `Edit Shipping Rate for ${shippingRate.countryName}` : ""}
            description={isEdit ? "Update the shipping rate information below." : ""}
            className="sm:max-w-[480px] max-h-[85vh] overflow-y-auto"
            trigger={trigger}
        >
            <ShippingRateForm  shippingRate={shippingRate} onSuccess={handleSuccess} onCancel={() => onOpenChange(false)} />
        </BaseModal>
    )
}
