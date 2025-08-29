"use client"

import type { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import type { Category } from "@/db/schema"
import Image from "next/image"
import { CategoryActionsCell } from "./category-actions-cell"

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
                alt="Category Image"
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
        accessorKey: "featured",
        header: "Featured",
        cell: ({ row }) => {
            const featured = row.getValue("featured") as boolean
            return (
                <div className="flex items-center">
          <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  featured ? "bg-amber-100 text-amber-800" : "bg-gray-100 text-gray-800"
              }`}
          >
            {featured ? "Featured" : "Regular"}
          </span>
                </div>
            )
        },
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => (
            <div className="text-center">
                <CategoryActionsCell category={row.original} />
            </div>
        ),
    },
]
