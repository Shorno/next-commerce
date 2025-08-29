"use client"
import { MoreHorizontal, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ConfirmDelete } from "./confirm-delete"
import { useState } from "react"
import type { Category } from "@/db/schema"
import {EditCategoryModal} from "@/components/admin-dashboard/edit-category-modal";

interface CategoryActionsCellProps {
    category: Category
}

export function CategoryActionsCell({ category }: CategoryActionsCellProps) {
    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const [isEditOpen, setEditOpen] = useState(false)
    const [isDeleteOpen, setDeleteOpen] = useState(false)

    const openModal = (type: "edit" | "delete") => {
        setDropdownOpen(false) // Close dropdown first
        if (type === "edit") {
            setEditOpen(true)
        } else {
            setDeleteOpen(true)
        }
    }

    return (
        <>
            <DropdownMenu open={isDropdownOpen} onOpenChange={setDropdownOpen}>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openModal("edit")}>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal("delete")}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <EditCategoryModal category={category} open={isEditOpen} onOpenChange={setEditOpen} />

            <ConfirmDelete category={category} open={isDeleteOpen} onOpenChange={setDeleteOpen} />
        </>
    )
}
