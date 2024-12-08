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
import DonorForm from "../form";
import { getDonorByIdAction } from "@/actions/donorActions";
import { DataTable } from "../../projects/data-table";
import { columns } from "../../projects/columns";
import { usePagination } from "@/hooks/use-pagination";

const DonorByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getDonorByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();

  React.useEffect(() => {
    if (id) {
      execute({ id, limit, skip });
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
                <BreadcrumbLink href="/app/donors">Donors</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {result.data && result.data.donor
                      ? result.data.donor.code
                      : "Donor Details"}
                  </BreadcrumbPage>{" "}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.donor && (
                <DonorForm
                  isOpen={isEditFormOpen}
                  donor={result.data.donor}
                  onClose={() => setIsEditFormOpen(false)}
                  onSuccess={() => {
                    execute({ id, limit, skip });
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col pb-4 border-b border-border">
          <h1 className="text-2xl font-semibold ">
            {result.data && result.data.donor
              ? result.data.donor.name
              : "Donor Details"}
          </h1>
          <p className="text-sm text-muted-foreground">
            This page provides detailed information about a specific donor. You
            can view the donor's name, code, and other relevant details.
            Additionally, you have the option to edit the donor's information or
            navigate back to the list of donors. This ensures that all donor
            records are accurate and up-to-date, facilitating better management
            of donor-related data.
          </p>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-col pb-2 mt-6">
            <h1 className="text-2xl font-semibold ">Projects</h1>{" "}
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

export default DonorByIdPage;
