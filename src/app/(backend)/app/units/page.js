"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import UnitForm from "./form"; // Updated to UnitForm
import { getUnitsAction } from "@/actions/unitActions"; // Updated to unitActions
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";

const UnitPage = () => {
  // Updated component name to UnitPage
  const [selectedUnit, setSelectedUnit] = useState(); // Updated state to selectedUnit
  const { isPending, execute, result } = useAction(getUnitsAction); // Updated action to getUnitsAction
  const { limit, skip, pagination, onPaginationChange } = usePagination();

  useEffect(() => {
    execute({
      skip: skip,
      limit: limit,
    });
  }, [pagination]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-background h-[66px] z-50">
        <div className="w-full flex items-center gap-2">
          <SidebarTrigger />
          <div className="border-r h-[20px] mr-2"></div>
          <div className="w-full flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/app/dashboard">
                    Dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Units</BreadcrumbPage>{" "}
                  {/* Updated to Units */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <UnitForm // Updated to UnitForm
                unit={selectedUnit} // Updated to unit
                onClose={() => setSelectedUnit(null)} // Updated to setSelectedUnit
                onSuccess={() => {
                  execute({
                    skip: skip,
                    limit: limit,
                  });
                  setSelectedUnit(null); // Updated to setSelectedUnit
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">Units</h1>{" "}
          {/* Updated to Units */}
        </div>
        <div className="w-full">
          <DataTable
            columns={columns({
              onEdit: (unit) => {
                setSelectedUnit(unit);
              },
            })}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.units // Updated to result.data.units
                ? result.data.units
                : []
            }
            rowCount={result.data?.totalUnits || 0} // Updated to totalUnits
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default UnitPage; // Updated to UnitPage
