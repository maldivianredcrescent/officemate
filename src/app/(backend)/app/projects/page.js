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
import ProjectForm from "./form"; // Updated to ProjectForm
import { getProjectsAction } from "@/actions/projectActions"; // Updated to getProjectsAction
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePagination } from "@/hooks/use-pagination";

const BudgetPage = () => {
  const [selectedProject, setSelectedProject] = useState(); // Updated to selectedProject
  const { isPending, execute, result } = useAction(getProjectsAction); // Updated to getProjectsAction
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
                  <BreadcrumbPage>Projects</BreadcrumbPage>{" "}
                  {/* Updated to Projects */}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <ProjectForm // Updated to ProjectForm
                donors={
                  result.data && result.data.donors ? result.data.donors : []
                }
                project={selectedProject} // Updated to project
                onClose={() => setSelectedProject(null)} // Updated to setSelectedProject
                onSuccess={() => {
                  execute({
                    skip: skip,
                    limit: limit,
                  });
                  setSelectedProject(null); // Updated to setSelectedProject
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold">Projects</h1>{" "}
        </div>
        <div className="w-full">
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

export default BudgetPage;
