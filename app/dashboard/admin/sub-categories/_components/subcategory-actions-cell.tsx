"use client"

import {MoreHorizontal, Edit, Trash2} from "lucide-react"
import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {useState} from "react"
import type {Subcategory} from "@/db/schema"
import {SubcategoryModal} from "@/app/dashboard/admin/sub-categories/_components/subcategory-modal";
import {ConfirmDeleteSubModal} from "@/app/dashboard/admin/sub-categories/_components/confirm-delete-sub-modal";


interface SubcategoryActionsCellProps {
    subcategory: Subcategory
}

export function SubcategoryActionsCell({subcategory}: SubcategoryActionsCellProps) {
    const [isDropdownOpen, setDropdownOpen] = useState(false)
    const [isEditOpen, setEditOpen] = useState(false)
    const [isDeleteOpen, setDeleteOpen] = useState(false)

    const openModal = (type: "edit" | "delete") => {
        setDropdownOpen(false)
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
                        <MoreHorizontal className="h-4 w-4"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => openModal("edit")}>
                        <Edit className="mr-2 h-4 w-4"/>
                        Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openModal("delete")}>
                        <Trash2 color={"red"} className="mr-2 h-4 w-4"/>
                        Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <SubcategoryModal mode="edit" subcategory={subcategory} open={isEditOpen} onOpenChange={setEditOpen}/>

            <ConfirmDeleteSubModal subcategory={subcategory} open={isDeleteOpen} onOpenChange={setDeleteOpen}/>
        </>
    )
}
