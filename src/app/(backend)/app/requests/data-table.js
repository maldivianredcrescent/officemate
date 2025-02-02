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
        <Input
          value={
            table.getColumn("activity.project.donor.code")?.getFilterValue() ??
            ""
          }
          placeholder="Filter by donor code..."
          onChange={(e) => {
            const value = e.target.value;
            setColumnFilters((prev) =>
              prev
                .filter((f) => f.id !== "activity.project.donor.code")
                .concat({
                  id: "activity.project.donor.code",
                  value,
                })
            );
          }}
        />
        <Input
          value={
            table.getColumn("activity.project.code")?.getFilterValue() ?? ""
          }
          placeholder="Filter by project code..."
          onChange={(e) => {
            const value = e.target.value;
            setColumnFilters((prev) =>
              prev
                .filter((f) => f.id !== "activity.project.code")
                .concat({
                  id: "activity.project.code",
                  value,
                })
            );
          }}
        />
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
