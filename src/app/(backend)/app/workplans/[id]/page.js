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
import WorkplanForm from "../form"; // Updated to import WorkplanForm
import { getWorkplanByIdAction } from "@/actions/workplaneActions";

const WorkplanByIdPage = () => {
  const router = useRouter();
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getWorkplanByIdAction); // Updated action

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
                      ? result.data.workplan.code
                      : "Workplan Details"}{" "}
                    {/* Updated to Workplan Details */}
                  </BreadcrumbPage>{" "}
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
        <div className="w-full flex flex-col pb-2">
          <h1 className="text-2xl font-semibold ">
            {result.data && result.data.workplan
              ? result.data.workplan.name // Updated to workplan
              : "Workplan Details"}{" "}
            {/* Updated to Workplan Details */}
          </h1>{" "}
        </div>
        <div className="w-full"></div>
      </div>
    </div>
  );
};

export default WorkplanByIdPage; // Updated export
