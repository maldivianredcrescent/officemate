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

export const columns = ({ onEdit }) => [
  {
    accessorKey: "number",
    header: "No.",
    cell: ({ row }) => {
      return <div>{row.getValue("number")}</div>;
    },
  },
  {
    id: "code",
    accessorKey: "code",
    header: "Activity Code",
  },
  {
    id: "name",
    accessorKey: "name",
    header: "Activity Name",
  },
  {
    id: "project.name",
    accessorKey: "project.name",
    header: "Project",
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => {
      const budget = parseFloat(row.getValue("budget"));

      // Format the budget as a currency amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "MVR",
      }).format(budget);

      return <div>{formatted}</div>;
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
      const activity = row.original;

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
                onClick={() => navigator.clipboard.writeText(activity.code)}
              >
                Copy Activity Code
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  onEdit(activity);
                }}
              >
                Edit Activity
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href={`/activities/${activity.id}`}>View Activity</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
