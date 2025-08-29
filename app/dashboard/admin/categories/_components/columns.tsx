"use client"
import {ColumnDef} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox";
import {Button} from "@/components/ui/button";
import {Edit, EyeIcon, MoreHorizontal, Trash} from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import * as React from "react";
import {Category} from "@/db/schema";
import Image from "next/image";
import {useTransition} from "react";
import {deleteCategory} from "@/actions/admin/categoris";
import {toast} from "sonner";
import {EditCategoryModal} from "@/components/admin-dashboard/edit-category-modal";

export const categoryColumns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({table}) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({row}) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={(value) => row.toggleSelected(!!value)}
                aria-label="Select row"
            />
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        accessorKey: "image",
        header: "Image",
        cell: ({row}) => (
            <Image src={row.getValue("image")} alt={"Category Image"} width={80} height={80} className="rounded-md"/>
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({row}) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "slug",
        header: () => <div>Slug</div>,
        cell: ({row}) => {
            return <div className="font-medium">{row.getValue("slug")}</div>
        },
    },
    {
        id: "actions",
        header: () => <div className={'text-center'}>Actions</div>,
        enableHiding: false,
        cell: ({row}) => {
            return (
                <div className={"text-center"}>
                    <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal/>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem><EyeIcon className={"mr-2 h-4 w-4"}/>View</DropdownMenuItem>
                            <DropdownMenuSeparator/>
                            <EditCategoryModal
                                category={row.original}
                                trigger={
                                    <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                                        <Edit className="mr-2 h-4 w-4"/>
                                        Edit
                                    </DropdownMenuItem>
                                }
                            />

                            <DropdownMenuSeparator/>
                            <DropdownMenuSeparator/>
                            <ConfirmDelete data={row.original}/>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            )
        },
    },
]


function ConfirmDelete({data}: { data: Category }) {
    const {id, name} = data
    const [isPending, startTransition] = useTransition()

    const onConfirm = () => {
        startTransition(async () => {
            try {
                const response = await deleteCategory(id)
                if (response.success) {
                    toast.success(response.message)
                } else {
                    toast.error(response.message)
                }
            } catch (error) {
                toast.error("Failed to delete category, please try again.")
            }
        })

    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <DropdownMenuItem className="text-red-600" onSelect={(e) => e.preventDefault()}>
                    <Trash className="mr-2 h-4 w-4"/>
                    Delete
                </DropdownMenuItem>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete category?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        “{name}”.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                    <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
                    <Button variant="destructive" onClick={onConfirm} disabled={isPending}>
                        {isPending ? "Deleting…" : "Confirm delete"}
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )


}