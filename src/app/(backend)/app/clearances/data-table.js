"use client";

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function DataTable({
  columns,
  data,
  pagination,
  onPaginationChange,
  rowCount,
  isPending,
}) {
  const [columnFilters, setColumnFilters] = useState([]);

  const table = useReactTable({
    data,
    columns,
    rowCount,
    getCoreRowModel: getCoreRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    manualPagination: true,
    onPaginationChange: onPaginationChange,
    state: {
      columnFilters,
      pagination,
    },
  });

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center gap-4 py-4">
        <Select
          value={table.getColumn("status")?.getFilterValue() ?? "all"}
          placeholder="Filter status..."
          onValueChange={(value) => {
            table.getColumn("status")?.setFilterValue(value);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem key="created" value="created">
              Pending
            </SelectItem>
            <SelectItem key="budget_approved" value="budget_approved">
              Budget Approved
            </SelectItem>
            <SelectItem key="payment_approved" value="payment_approved">
              Payment Approved
            </SelectItem>
            <SelectItem key="rejected" value="rejected">
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="rounded-xl border overflow-hidden">
        <Table className="w-full">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      className="whitespace-nowrap font-semibold text-black/50 bg-gray-50"
                      key={header.id}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell className="py-2 whitespace-nowrap" key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                {!isPending && data.length === 0 && (
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    No results.
                  </TableCell>
                )}
                {isPending && (
                  <TableCell
                    colSpan={columns.length}
                    className="h-20 text-center"
                  >
                    <div className="flex items-center justify-center">
                      <Loader2 className="animate-spin" />
                    </div>
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </Button>
      </div>
    </>
  );
}
