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
import { DataTable } from "@/app/(backend)/app/requests/data-table";
import { columns } from "@/app/(backend)/app/requests/columns";
import RequestForm from "@/app/(backend)/app/requests/form";
import React, { useEffect, useState } from "react";
import { getDashboardRequestsAction } from "@/actions/dashboardActions";
import { useAction } from "next-safe-action/hooks";
import { usePagination } from "@/hooks/use-pagination";
import { useSearchParams } from "next/navigation";

export default function AdminHomePage() {
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { isPending, execute, result } = useAction(getDashboardRequestsAction); // Updated to use getRequestsAction
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
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.activities && (
                <RequestForm
                  activities={result.data?.activities || []}
                  request={selectedRequest} // Updated prop name
                  onClose={() => setSelectedRequest(null)}
                  onSuccess={() => {
                    execute({
                      skip: skip,
                      limit: limit,
                    });
                    setSelectedRequest(null);
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">Recent Requests</h1>{" "}
          {/* Updated to Requests */}
        </div>
        <div className="w-full">
          <DataTable
            type={params.get("type")}
            columns={columns}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.requests // Updated to requests
                ? result.data.requests
                : []
            }
            rowCount={result.data?.totalRequests || 0} // Updated to totalRequests
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
}
