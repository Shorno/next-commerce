"use client"

import type {ColumnDef} from "@tanstack/react-table"
import type {Category, Subcategory} from "@/db/schema"
import Image from "next/image"
import {SubcategoryActionsCell} from "@/app/dashboard/admin/sub-categories/_components/subcategory-actions-cell";
import Link from "next/link";

export const subcategoryColumns: ColumnDef<Subcategory>[] = [
    {
        accessorKey: "image",
        header: "Image",
        cell: ({row}) => (
            <Image
                src={row.getValue("image") || "/placeholder.svg"}
                alt="Category Image"
                width={100}
                height={100}
                className="rounded-md object-cover aspect-video"
            />
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
            return <div className="font-medium">/category/{row.getValue("slug")}</div>
        },
    },
    {
        accessorKey: "category",
        header: () => <div>Category</div>,
        cell: ({row}) => {
            const category = row.getValue("category") as Category
            return <Link href={"/dashboard/admin/categories"}  className="font-medium text-blue-500 underline">{category.name}</Link>
        },
    },
    {
        accessorKey: "featured",
        header: "Featured",
        cell: ({row}) => {
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
        cell: ({row}) => (
            <div className="text-center">
                <SubcategoryActionsCell subcategory={row.original}/>
            </div>
        ),
    },
]
