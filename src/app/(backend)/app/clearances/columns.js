"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import moment from "moment";

export const columns = [
  {
    accessorKey: "number",
    header: "Clearance No.",
    cell: ({ row }) => {
      return (
        <div className="font-[600]">
          MRCC/{moment(row.getValue("createdAt")).format("YYYY")}/
          {row.getValue("number")}
        </div>
      );
    },
  },
  {
    accessorKey: "request.title",
    header: "Request",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      switch (row.getValue("status")) {
        case "created":
          return (
            <div className="flex">
              <div className="bg-orange-100 rounded-full text-orange-600 font-[600] text-xs px-3 py-1 text-center">
                Pending
              </div>
            </div>
          );
        case "submitted":
          return (
            <div className="flex">
              <div className="bg-blue-100 rounded-full text-blue-600 font-[600] text-xs px-3 py-1 text-center">
                Submitted
              </div>
            </div>
          );
        case "budget_approved":
          return (
            <div className="flex">
              <div className="bg-blue-100 rounded-full text-blue-600 font-[600] text-xs px-3 py-1 text-center">
                Budget Approved
              </div>
            </div>
          );
        case "finance_approved":
          return (
            <div className="flex">
              <div className="bg-blue-100 rounded-full text-blue-600 font-[600] text-xs px-3 py-1 text-center">
                Finance Approved
              </div>
            </div>
          );
        case "completed":
          return (
            <div className="flex">
              <div className="bg-green-100 rounded-full text-green-600 font-[600] text-xs px-3 py-1 text-center">
                Completed
              </div>
            </div>
          );
        case "rejected":
          return (
            <div className="flex">
              <div className="bg-red-100 rounded-full text-red-600 font-[600] text-xs px-3 py-1 text-center">
                Rejected
              </div>
            </div>
          );
        default:
          return <div>{row.getValue("status")}</div>;
      }
    },
  },
  {
    accessorKey: "incompleteRemarks",
    header: "Incompleted",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("incompleteRemarks") ? (
            <div className="flex">
              <div className="bg-red-100 rounded-full text-red-600 font-[600] text-xs px-3 py-1 text-center">
                Yes
              </div>
            </div>
          ) : (
            <div className="flex">
              <div className="bg-gray-100 rounded-full text-black font-[600] text-xs px-3 py-1 text-center">
                No
              </div>
            </div>
          )}
        </div>
      );
    },
  },
  {
    id: "totalAmount",
    accessorKey: "request.requestItems.amount",
    header: "Total Requested",
    cell: ({ row }) => {
      const totalAmount = row.original.request.requestItems.reduce(
        (sum, item) => sum + item.amount,
        0
      );
      return (
        <div>
          MVR{" "}
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    id: "totalExpenditure",
    accessorKey: "request.requestItems.expenditureAmount",
    header: "Total Expenditure",
    cell: ({ row }) => {
      const totalAmount = row.original.request.requestItems.reduce(
        (sum, item) => sum + item.expenditure,
        0
      );
      return (
        <div>
          MVR{" "}
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("createdAt")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("updatedAt")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clearance = row.original;

      return (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigator.clipboard.writeText(
                    `${window.location.origin}/app/clearances/${clearance.id}`
                  )
                }
              >
                Copy Clearance URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href={`/app/clearances/${clearance.id}`}>
                  View Clearance
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
