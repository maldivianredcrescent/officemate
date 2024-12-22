"use client";

import { MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import moment from "moment";

export const columns = ({
  onEdit,
  onDelete,
  showExpenditure,
  onExpenditureUpdate,
}) => [
  {
    accessorKey: "name",
    header: "Description",
    cell: ({ row }) => {
      return <div className="font-[600]">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "qty",
    header: "Quantity",
  },
  {
    accessorKey: "rate",
    header: "Rate",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("rate").toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      return (
        <div>
          {row.getValue("amount").toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
      );
    },
  },
  ...(showExpenditure
    ? [
        {
          accessorKey: "expenditure",
          header: "Expenditure",
          cell: ({ row }) => {
            return (
              <div>
                {row.getValue("expenditure").toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            );
          },
        },
      ]
    : []),
  {
    accessorKey: "remarks",
    header: "Remarks",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const requestItem = row.original;

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
              {onEdit && (
                <DropdownMenuItem
                  onClick={() => {
                    onEdit(requestItem);
                  }}
                >
                  Edit Item
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(requestItem);
                  }}
                >
                  Delete Item
                </DropdownMenuItem>
              )}
              {onExpenditureUpdate && (
                <DropdownMenuItem
                  onClick={() => {
                    onExpenditureUpdate(requestItem);
                  }}
                >
                  Update Expenditure
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
