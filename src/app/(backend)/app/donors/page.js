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
import DonorForm from "./form";
import { getDonorsAction } from "@/actions/donorActions";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useSearchParams } from "next/navigation";
import { usePagination } from "@/hooks/use-pagination";

const DonorPage = () => {
  const [selectedDonor, setSelectedDonor] = useState();
  const { isPending, execute, result } = useAction(getDonorsAction);
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
                  <BreadcrumbPage>Donors</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <DonorForm
                donor={selectedDonor}
                onClose={() => setSelectedDonor(null)}
                onSuccess={() => {
                  execute({
                    skip: skip,
                    limit: limit,
                  });
                  setSelectedDonor(null);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">Donors</h1>
        </div>
        <div className="w-full">
          <DataTable
            columns={columns}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.donors
                ? result.data.donors
                : []
            }
            rowCount={result.data?.totalDonors || 0}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default DonorPage;
