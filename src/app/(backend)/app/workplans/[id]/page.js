"use client";

import React, { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import WorkplanForm from "../form";
import { getWorkplanByIdAction } from "@/actions/workplaneActions";
import { usePagination } from "@/hooks/use-pagination";
import { DataTable } from "../../activities/data-table";
import { columns } from "../../activities/columns";
import ActivityForm from "../../activities/form";

const WorkplanByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getWorkplanByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [selectedActivity, setSelectedActivity] = useState();

  React.useEffect(() => {
    if (id) {
      execute({ id });
    }
  }, [id]);

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
                <BreadcrumbLink href="/app/workplans">
                  Workplans
                </BreadcrumbLink>{" "}
                {/* Updated to Workplans */}
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {result.data && result.data.workplan
                      ? result.data.workplan.name
                      : "Workplan Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.workplan && (
                <WorkplanForm
                  isOpen={isEditFormOpen}
                  donors={
                    result.data && result.data.donors ? result.data.donors : []
                  }
                  workplan={result.data.workplan} // Updated to workplan
                  onClose={() => setIsEditFormOpen(false)}
                  onSuccess={() => {
                    execute({ id });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col gap-2 pb-4 border-b border-border">
          <h1 className="text-2xl font-semibold ">
            {result.data && result.data.workplan
              ? result.data.workplan.name
              : "Workplan Details"}
          </h1>
          <p className="text-sm text-muted-foreground">
            {result.data && result.data.workplan
              ? result.data.workplan.description
              : ""}
          </p>
        </div>
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 mt-4 gap-4">
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Total Projects</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.activities.length}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Budgeted</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.availableBudget
                ? `MVR ${result.data.availableBudget
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Used</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.totalRequestItemsAmount
                ? `MVR ${result.data.totalRequestItemsAmount
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Remaining</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.remainingBudget
                ? `MVR ${result.data.remainingBudget
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-row items-center justify-between pb-2">
            <h1 className="text-2xl font-semibold ">Activities</h1>
            {result.data && result.data.allProjects && (
              <ActivityForm
                activity={selectedActivity}
                workplan={result.data.workplan}
                projects={result.data.allProjects}
                onSuccess={() => {
                  setSelectedActivity();
                  execute({ id });
                }}
                onClose={() => {
                  setSelectedActivity();
                }}
              />
            )}
          </div>
          <DataTable
            columns={columns({
              onEdit: (activity) => {
                setSelectedActivity(activity);
              },
            })}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.activities
                ? result.data.activities
                : []
            }
            rowCount={result.data?.totalActivities || 0}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkplanByIdPage; // Updated export
