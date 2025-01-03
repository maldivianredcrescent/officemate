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
import BudgetForm from "./form";
import { useAction } from "next-safe-action/hooks";
import { getWorkplansAction } from "@/actions/workplaneActions";
import { usePagination } from "@/hooks/use-pagination";
import WorkplanForm from "./form";
import { DataTable } from "./data-table";
import { columns } from "./columns";

const BudgetPage = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedWorkplan, setSelectedWorkplan] = useState();
  const { isPending, execute, result } = useAction(getWorkplansAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();

  useEffect(() => {
    execute({ skip, limit });
  }, [execute, skip, limit]);

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-background h-[66px]">
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
                  <BreadcrumbPage>Workplans</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <WorkplanForm
                workplan={selectedWorkplan}
                onSuccess={() => {
                  setIsDialogOpen(false);
                  execute({ skip, limit });
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold">Workplans</h1>{" "}
        </div>
        <div className="w-full">
          <DataTable
            columns={columns}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.workplans
                ? result.data.workplans
                : []
            }
            rowCount={result.data?.totalWorkplans || 0}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default BudgetPage;
