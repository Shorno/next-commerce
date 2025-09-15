"use client"
import type {ColumnDef} from "@tanstack/react-table"
import {CountryWithShippingRate} from "@/actions/store/storeShippingDetails";
import {
    ShippingRateActionsCell
} from "@/app/dashboard/seller/(store)/stores/[slug]/shipping/_components/ShippingRateActionsCell";


export const shippingRateColumns: ColumnDef<CountryWithShippingRate>[] = [
    {
        accessorKey: "countryName",
        id: "countryName",
        header: "Country",
        cell: ({row}) => <div>{row.original.countryName} ({row.original.countryCode})</div>,
    },
    {
        accessorFn: (row) => row.shippingRate?.shippingService ?? "Default",
        accessorKey: "shippingService",
        header: "Service",
        cell: ({row}) => <div>{row.original.shippingRate?.shippingService ?? "Default"}</div>,
    },
    {
        accessorKey: "shippingCostPerItem",
        header: "Cost / Item",
        cell: ({row}) => <div>{row.original.shippingRate?.shippingCostPerItem ?? "Default"}</div>,
    },
    {
        accessorKey: "shippingCostAdditionalItem",
        header: "Cost / Add. Item",
        cell: ({row}) => <div>{row.original.shippingRate?.shippingCostAdditionalItem ?? "Default"}</div>,
    },
    {
        accessorKey: "shippingCostPerKg",
        header: "Cost / Kg",
        cell: ({row}) => <div>{row.original.shippingRate?.shippingCostPerKg ?? "Default"}</div>,
    },
    {
        accessorKey: "shippingCostFixed",
        header: "Fixed Cost",
        cell: ({row}) => <div>{row.original.shippingRate?.shippingCostFixed ?? "Default"}</div>,
    },
    {
        accessorKey: "minimumDeliveryTime",
        header: "Min Days",
        cell: ({row}) => <div>{row.original.shippingRate?.minimumDeliveryTime ?? "Default"}</div>,
    },
    {
        accessorKey: "maximumDeliveryTime",
        header: "Max Days",
        cell: ({row}) => <div>{row.original.shippingRate?.maximumDeliveryTime ?? "Default"}</div>,
    },
    {
        accessorKey: "returnPolicy",
        header: "Return Policy",
        cell: ({row}) => (
            <div className="truncate max-w-[200px]">{row.original.shippingRate?.returnPolicy ?? "Default"}</div>
        ),
    },
    {
        id: "actions",
        header: () => <div className="text-center">Actions</div>,
        enableHiding: false,
        cell: ({ row }) => (
            <div className="text-center">
                <ShippingRateActionsCell shippingRate={row.original} />
            </div>
        ),
    },

]
