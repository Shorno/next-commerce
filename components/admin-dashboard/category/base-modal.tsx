"use client"

import type React from "react"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
} from "@/components/ui/alert-dialog"

interface BaseModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: React.ReactNode
    variant?: "dialog" | "alert"
    className?: string
    description?: string
}

export function BaseModal({
                              open,
                              onOpenChange,
                              title,
                              children,
                              variant = "dialog",
                              className = "sm:max-w-[480px]",
                              description,
                          }: BaseModalProps) {
    if (variant === "alert") {
        return (
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent className={className}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        {description && <AlertDialogDescription>{description}</AlertDialogDescription>}
                    </AlertDialogHeader>
                    {children}
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${className} max-h-[85vh] overflow-y-auto`}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}
