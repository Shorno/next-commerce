"use client"

import BasicInfoForm from "@/app/dashboard/seller/stores/new/_components/basic-info-form";
import StoreContactForm from "@/app/dashboard/seller/stores/new/_components/store-contact-form";
import StorePolicyForm from "@/app/dashboard/seller/stores/new/_components/store-policy-form";

export default function NewStorePage() {
    return (
        <>
            <BasicInfoForm/>
            <StoreContactForm/>
            <StorePolicyForm/>
        </>
    )
}