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
import RequestForm from "../form";
import { getRequestByIdAction } from "@/actions/requestActions";
import { usePagination } from "@/hooks/use-pagination";
import RequestItemForm from "../../request-items/form";
import { DataTable } from "../../request-items/data-table";
import { columns } from "../../request-items/columns";
import moment from "moment";
import { deleteRequestItemAction } from "@/actions/requestItemActions";

const RequestByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getRequestByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [selectedRequestItem, setSelectedRequestItem] = useState(null);
  const { isPending: isDeletePending, execute: deleteRequestItem } = useAction(
    deleteRequestItemAction
  );

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
                <BreadcrumbLink href="/app/requests">Requests</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Request Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data && result.data.request && (
                <RequestForm
                  activities={result.data?.activities || []}
                  isOpen={isEditFormOpen}
                  request={result.data.request}
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
        <div className="w-full flex flex-col justify-between pb-4 capitalize">
          <h1 className="text-2xl font-semibold mb-2">
            {result.data && result.data.request
              ? result.data.request.type + " request"
              : "Request Details"}
          </h1>
          {result.data && result.data.request && (
            <div className="mt-4">
              <div className="w-full flex flex-col space-y-2">
                <div className="rounded-lg border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
                  <div className="w-full">
                    <div>
                      <p className="text-sm border-b border-t border-t-transparent border-border py-3 font-[500] px-4 bg-gray-50">
                        Created At
                      </p>
                      <p className="py-3 px-4 text-sm">
                        {result.data && result.data.request
                          ? moment(result.data.request.createdAt).format(
                              "DD-MM-YYYY"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <div>
                      <p className="text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[500] px-4 bg-gray-50">
                        Type of Request
                      </p>
                      <p className="py-3 px-4 text-sm capitalize">
                        {result.data && result.data.request.type
                          ? result.data.request.type
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <div>
                      <p className="text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[500] px-4 bg-gray-50">
                        Project
                      </p>
                      <p className="py-3 px-4 text-sm capitalize">
                        {result.data && result.data.request.activity
                          ? result.data.request.activity.project.name
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <div>
                      <p className="text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[500] px-4 bg-gray-50">
                        Donor
                      </p>
                      <p className="py-3 px-4 text-sm capitalize">
                        {result.data && result.data.request.activity
                          ? result.data.request.activity.project.donor.name
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="w-full">
            <DataTable
              columns={columns({
                onEdit: (requestItem) => {
                  setSelectedRequestItem(requestItem);
                },
                onDelete: async (requestItem) => {
                  await deleteRequestItem({ id: requestItem.id });
                  execute({ id, limit, skip });
                },
              })}
              isPending={isPending}
              data={
                !isPending && result.data && result.data.request.requestItems
                  ? result.data.request.requestItems
                  : []
              }
              // onPaginationChange={onPaginationChange}
              // pagination={pagination}
            />
            <div className="my-4 flex justify-end">
              {result.data && result.data.request && (
                <RequestItemForm
                  requestItem={selectedRequestItem}
                  request={result.data.request}
                  onSuccess={() => {
                    execute({ id, limit, skip });
                    setSelectedRequestItem(null);
                  }}
                  onClose={() => setSelectedRequestItem(null)}
                />
              )}
            </div>
          </div>
          <div className="w-full flex flex-col space-y-2">
            <div className="rounded-lg border grid lg:grid-cols-3 grid-cols-1 overflow-hidden">
              <div className="w-full">
                <div>
                  <p className="text-sm border-b border-t border-t-transparent border-border py-3 font-[500] px-4 bg-gray-50">
                    Submitted By
                  </p>
                  <p className="py-3 px-4 text-sm">
                    {result.data && result.data.request.submittedBy
                      ? result.data.request.submittedBy.name
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-full">
                <div>
                  <p className="text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[500] px-4 bg-gray-50">
                    Budget Approved By
                  </p>
                  <p className="py-3 px-4 text-sm">
                    {result.data && result.data.request.budgetApprovedBy
                      ? result.data.request.budgetApprovedBy.name
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="w-full">
                <div>
                  <p className="text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[500] px-4 bg-gray-50">
                    Finance Approved By
                  </p>
                  <p className="py-3 px-4 text-sm">
                    {result.data && result.data.request.financeApprovedBy
                      ? result.data.request.financeApprovedBy.name
                      : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestByIdPage; // Updated to RequestByIdPage
