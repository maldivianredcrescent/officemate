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

export const columns = ({ onEdit, onDelete }) => [
  {
    accessorKey: "name",
    header: "Document Name",
    cell: ({ row }) => {
      return <div className="font-[600]">{row.getValue("name")}</div>;
    },
  },
  {
    accessorKey: "documentUrl",
    header: "Document URL",
    cell: ({ row }) => {
      return (
        <div>
          <a
            className="underline"
            href={row.getValue("documentUrl")}
            target="_blank"
            rel="noopener noreferrer"
          >
            View Document
          </a>
        </div>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("createdAt")).format("DD-MM-YYYY")}</div>
      );
    },
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("updatedAt")).format("DD-MM-YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const clearanceDocument = row.original;

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
                    onEdit(clearanceDocument);
                  }}
                >
                  Edit Document
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem
                  onClick={() => {
                    onDelete(clearanceDocument);
                  }}
                >
                  Delete Document
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    },
  },
];
