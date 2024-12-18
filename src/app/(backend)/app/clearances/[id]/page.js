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
import {
  completedRequestAction,
  getRequestByIdAction,
  submitRequestForApprovalAction,
  submitRequestForBudgetApprovalAction,
  submitRequestForFinanceApprovalAction,
} from "@/actions/requestActions";
import { usePagination } from "@/hooks/use-pagination";
import RequestItemForm from "../../request-items/form";
import { DataTable } from "../../request-items/data-table";
import { columns } from "../../request-items/columns";
import moment from "moment";
import { deleteRequestItemAction } from "@/actions/requestItemActions";
import { Button } from "@/components/ui/button";

const RequestByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getRequestByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [selectedRequestItem, setSelectedRequestItem] = useState(null);
  const { isPending: isDeletePending, execute: deleteRequestItem } = useAction(
    deleteRequestItemAction
  );
  const { isPending: isSubmitPending, execute: submitRequestForApproval } =
    useAction(submitRequestForApprovalAction);
  const { isPending: isBudgetApprovedPending, execute: budgetApprovedRequest } =
    useAction(submitRequestForBudgetApprovalAction);
  const {
    isPending: isSubmitFinancePending,
    execute: submitRequestForFinanceApproval,
  } = useAction(submitRequestForFinanceApprovalAction);
  const { isPending: isCompletedPending, execute: completedRequest } =
    useAction(completedRequestAction);

  React.useEffect(() => {
    if (id) {
      execute({ id, limit, skip });
    }
  }, [id]);

  const renderStatus = (status) => {
    switch (status) {
      case "created":
        return (
          <div className="flex">
            <div className="bg-[#0F172A] rounded-full text-white font-[600] text-xs px-3 py-1 text-center">
              Created
            </div>
          </div>
        );
      case "submitted":
        return (
          <div className="flex">
            <div className="bg-[#0F172A] rounded-full text-white font-[600] text-xs px-3 py-1 text-center">
              Submitted
            </div>
          </div>
        );
      case "budget_approved":
        return (
          <div className="flex">
            <div className="bg-[#A5F3FC] rounded-full text-[#020617] font-[600] text-xs px-3 py-1 text-center">
              Budget Approved
            </div>
          </div>
        );
      case "finance_approved":
        return (
          <div className="flex">
            <div className="bg-[#0891B2] rounded-full text-white font-[600] text-xs px-3 py-1 text-center">
              Finance Approved
            </div>
          </div>
        );
      case "completed":
        return (
          <div className="flex">
            <div className="bg-[#0F172A] rounded-full text-white font-[600] text-xs px-3 py-1 text-center">
              Completed
            </div>
          </div>
        );
      case "rejected":
        return (
          <div className="flex">
            <div className="bg-red-500 rounded-full text-white font-[600] text-xs px-3 py-1 text-center">
              Rejected
            </div>
          </div>
        );
      default:
        return <div>N/A</div>;
    }
  };

  const renderButtons = (status) => {
    switch (status) {
      case "created":
        return (
          <Button
            onClick={async () => {
              await submitRequestForApproval({ id: result.data.request.id });
              execute({ id, limit, skip });
            }}
          >
            Submit for Approval
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6"
              color={"#ffffff"}
              fill={"none"}
            >
              <path
                d="M20.0001 11.9998L4.00012 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        );
      case "submitted":
        return (
          <Button
            onClick={async () => {
              await budgetApprovedRequest({ id: result.data.request.id });
              execute({ id, limit, skip });
            }}
          >
            Approve Budget
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6"
              color={"#ffffff"}
              fill={"none"}
            >
              <path
                d="M20.0001 11.9998L4.00012 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        );
      case "budget_approved":
        return (
          <Button
            onClick={async () => {
              await submitRequestForFinanceApproval({
                id: result.data.request.id,
              });
              execute({ id, limit, skip });
            }}
          >
            Approve Finance
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6"
              color={"#ffffff"}
              fill={"none"}
            >
              <path
                d="M20.0001 11.9998L4.00012 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        );
      case "finance_approved":
        return (
          <Button
            onClick={async () => {
              await completedRequest({ id: result.data.request.id });
              execute({ id, limit, skip });
            }}
          >
            Completed
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              className="size-6"
              color={"#ffffff"}
              fill={"none"}
            >
              <path
                d="M20.0001 11.9998L4.00012 11.9998"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M15.0003 17C15.0003 17 20.0002 13.3176 20.0002 12C20.0002 10.6824 15.0002 7 15.0002 7"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Button>
        );
    }
  };

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
                  <BreadcrumbPage>Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              {result.data &&
                result.data.request &&
                [
                  "created",
                  "submitted",
                  "budget_approved",
                  "finance_approved",
                ].includes(result.data?.request?.status) && (
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
          <div className="w-full flex items-center gap-4 mb-2">
            <h1 className="text-2xl font-semibold">
              {result.data && result.data.request
                ? result.data.request.type + " request"
                : "Request Details"}
            </h1>
            <div>{renderStatus(result.data?.request?.status)}</div>
          </div>
          {result.data && result.data.request && (
            <div className="mt-4">
              <div className="w-full flex flex-col space-y-2">
                <div className="rounded-lg border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
                  <div className="w-full">
                    <div>
                      <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
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
                      <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
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
                      <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
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
                      <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
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
                onEdit: async (requestItem) => {
                  setSelectedRequestItem(requestItem);
                },
                onDelete: async (requestItem) => {
                  await deleteRequestItem({ id: requestItem.id });
                  await execute({ id, limit, skip });
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
            <div className="my-6 flex items-center justify-between">
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
              <div>{renderButtons(result.data?.request?.status)}</div>
            </div>
          </div>
          {result.data?.request?.status !== "created" && (
            <div className="w-full flex flex-col space-y-2">
              <div className="rounded-lg border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
                      Submitted By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        {result.data && result.data.request.submittedBy
                          ? result.data.request.submittedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.request.submittedAt
                          ? moment(result.data.request.submittedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                      Budget Approved By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        {result.data && result.data.request.budgetApprovedBy
                          ? result.data.request.budgetApprovedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.request.budgetApprovedAt
                          ? moment(result.data.request.budgetApprovedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                      Finance Approved By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        {result.data && result.data.request.financeApprovedBy
                          ? result.data.request.financeApprovedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.request.financeApprovedAt
                          ? moment(
                              result.data.request.financeApprovedAt
                            ).format("DD MMM YYYY HH:mm")
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                      Completed By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        {result.data && result.data.request.completedBy
                          ? result.data.request.completedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.request.completedAt
                          ? moment(result.data.request.completedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : ""}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="w-full flex flex-col space-y-2 mt-6 bg-gray-50 rounded-lg p-4 border border-border">
            <p className="text-sm text-black/50 font-[600]">Request Remarks</p>
            <p className="text-sm lg:mr-[20rem] mr-0">
              {result.data?.request?.remarks || "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestByIdPage; // Updated to RequestByIdPage
