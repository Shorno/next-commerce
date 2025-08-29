"use client"
import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category } from "@/db/schema"
import Image from "next/image"
import {CategoryActionsCell} from "@/app/dashboard/admin/categories/_components/category-actions-cell";

export const categoryColumns: ColumnDef<Category>[] = [
    {
        id: "select",
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
                onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Select all"
            />
        ),
        cell: ({ row }) => (
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
        cell: ({ row }) => (
            <Image
                src={row.getValue("image") || "/placeholder.svg"}
                alt={"Category Image"}
                width={80}
                height={80}
                className="rounded-md"
            />
        ),
    },
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => <div>{row.getValue("name")}</div>,
    },
    {
        accessorKey: "slug",
        header: () => <div>Slug</div>,
        cell: ({ row }) => {
            return <div className="font-medium">{row.getValue("slug")}</div>
        },
    },
    {
        id: "actions",
        header: () => <div className={"text-center"}>Actions</div>,
        enableHiding: false,
        cell: ({ row }) => (
            <div className={"text-center"}>
                <CategoryActionsCell category={row.original} />
            </div>
        ),
    },
]

