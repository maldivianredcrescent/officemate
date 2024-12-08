"use client";

import React, { useState } from "react";
import { getProjectByIdAction } from "@/actions/projectActions"; // Assuming this action fetches a project by ID
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
import ProjectForm from "../form";

const ProjectByIdPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getProjectByIdAction);

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
                <BreadcrumbLink href="/app/projects">Projects</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {result.data && result.data.project
                      ? result.data.project.code
                      : "Project Details"}
                  </BreadcrumbPage>{" "}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.project && (
                <ProjectForm
                  isOpen={isEditFormOpen}
                  donors={
                    result.data && result.data.donors ? result.data.donors : []
                  }
                  project={result.data.project}
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
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">
            {result.data && result.data.project
              ? result.data.project.name
              : "Project Details"}
          </h1>{" "}
          {/* Updated to Projects */}
        </div>
        <div className="w-full"></div>
      </div>
    </div>
  );
};

export default ProjectByIdPage;
