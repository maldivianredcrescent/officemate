"use client";

import React, { useState } from "react";
import { useAction } from "next-safe-action/hooks";
import { useParams, useRouter } from "next/navigation";
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
import { DataTable } from "../../projects/data-table";
import { columns } from "../../projects/columns";
import { usePagination } from "@/hooks/use-pagination";
import AddProjectForm from "./add-project";

const WorkplanByIdPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getWorkplanByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();

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
        <div className="w-full">
          <div className="w-full flex flex-row items-center justify-between pb-2 mt-6">
            <h1 className="text-2xl font-semibold ">Projects</h1>{" "}
            {result.data && result.data.allProjects && (
              <AddProjectForm
                workplan={result.data.workplan}
                projects={result.data.allProjects}
                onSuccess={() => {
                  execute({ id });
                }}
              />
            )}
          </div>
          <DataTable
            columns={columns}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.projects // Updated to result.data.projects
                ? result.data.projects
                : []
            }
            rowCount={result.data?.totalProjects || 0} // Updated to totalProjects
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default WorkplanByIdPage; // Updated export
