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
import ClearanceForm from "./form"; // Updated to use ClearanceForm
import { getClearanceRequestsAction } from "@/actions/clearanceActions"; // Updated to use getClearanceRequestsAction
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchParams } from "next/navigation";

const ClearancePage = () => {
  // Updated component name to ClearancePage
  const [selectedClearance, setSelectedClearance] = useState(); // Updated state variable
  const { isPending, execute, result } = useAction(getClearanceRequestsAction); // Updated to use getClearanceRequestsAction
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const params = useSearchParams();

  useEffect(() => {
    execute({
      skip: skip,
      limit: limit,
      type: params.get("type") || "",
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
                  <BreadcrumbPage>Clearances</BreadcrumbPage>{" "}
                  {/* Updated to Clearances */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.activities && (
                <ClearanceForm
                  activities={result.data?.activities || []}
                  request={selectedClearance} // Updated prop name
                  onClose={() => setSelectedClearance(null)}
                  onSuccess={() => {
                    execute({
                      skip: skip,
                      limit: limit,
                    });
                    setSelectedClearance(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">Clearances</h1>{" "}
          {/* Updated to Clearances */}
        </div>
        <div className="w-full">
          <DataTable
            type={params.get("type")}
            columns={columns}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.clearances // Updated to clearances
                ? result.data.clearances
                : []
            }
            rowCount={result.data?.totalClearances || 0} // Updated to totalClearances
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default ClearancePage; // Updated to ClearancePage
