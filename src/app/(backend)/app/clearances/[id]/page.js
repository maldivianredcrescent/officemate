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
import ClearanceForm from "../form";
import { usePagination } from "@/hooks/use-pagination";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../request-items/data-table";
import {
  completeClearanceAction,
  getClearanceByIdAction,
} from "@/actions/clearanceActions";
import {
  submitClearanceForApprovalAction,
  submitClearanceForBudgetApprovalAction,
  submitClearanceForFinanceApprovalAction,
} from "@/actions/clearanceActions";
import { columns } from "../../request-items/columns";
import SignaturePopup from "../signature-popup";

const ClearanceByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getClearanceByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [isSignaturePopupOpen, setIsSignaturePopupOpen] = useState(false);

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
                <BreadcrumbLink href="/app/clearances">
                  Clearances
                </BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Details</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col justify-between pb-4 capitalize">
          <div className="w-full flex flex-row items-center justify-between gap-4 mb-2">
            <div className="flex flex-row gap-3 items-center">
              <h1 className="text-2xl font-semibold">
                {result.data && result.data.clearance
                  ? "Clearance for " + result.data.clearance.request.title
                  : "Clearance Details"}
              </h1>
              <div>{renderStatus(result.data?.clearance?.status)}</div>
            </div>
            <div className="text-xl font-semibold">
              {result.data && result.data.totalAmount
                ? "MVR " +
                  result.data.totalAmount.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })
                : ""}
            </div>
          </div>
          {result.data && result.data.clearance && (
            <div className="mt-4">
              <div className="w-full flex flex-col space-y-2">
                <div className="rounded-lg border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
                  <div className="w-full">
                    <div>
                      <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
                        Created At
                      </p>
                      <p className="py-3 px-4 text-sm">
                        {result.data && result.data.clearance
                          ? moment(result.data.clearance.createdAt).format(
                              "DD-MM-YYYY"
                            )
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="w-full">
                    <div>
                      <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                        Request Title
                      </p>
                      <p className="py-3 px-4 text-sm capitalize">
                        {result.data && result.data.clearance.request.title
                          ? result.data.clearance.request.title
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
                        {result.data && result.data.clearance.request.activity
                          ? result.data.clearance.request.activity.project.name
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
                        {result.data && result.data.clearance.request.activity
                          ? result.data.clearance.request.activity.project.donor
                              .name
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
                onEdit: null,
                onDelete: null,
              })}
              isPending={isPending}
              data={
                !isPending &&
                result.data &&
                result.data.clearance.request.requestItems
                  ? result.data.clearance.request.requestItems
                  : []
              }
            />
            <div className="w-full flex flex-col space-y-2 mt-6">
              <div className="rounded-lg border flex flex-col lg:flex-row overflow-hidden">
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
                      Total Requested
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        MVR{" "}
                        {result.data && result.data.totalAmount
                          ? result.data.totalAmount
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                      Expenditure
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        MVR{" "}
                        {result.data && result.data.clearance.expenditure
                          ? result.data.clearance.expenditure
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                      Balance
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        MVR{" "}
                        {result.data && result.data.totalAmount
                          ? result.data.totalAmount -
                            result.data.clearance.expenditure
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                </div>
                {result.data?.clearance?.status !== "completed" && (
                  <div className="w-full">
                    <div>
                      <p className="text-black/50 text-sm border-b lg:border-t-transparent border-t border-border py-3 font-[600] px-4 bg-gray-50">
                        Action
                      </p>
                      <div className="py-3 px-4 text-sm flex flex-col gap-1">
                        <div>
                          <ClearanceForm
                            isOpen={isEditFormOpen}
                            clearance={result.data?.clearance}
                            onSuccess={() => {
                              setIsEditFormOpen(false);
                              execute({ id, limit, skip });
                            }}
                            onClose={() => setIsEditFormOpen(false)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="my-6 flex items-center justify-between">
              <div>
                {[
                  "created",
                  "submitted",
                  "budget_approved",
                  "finance_approved",
                ].includes(result.data?.clearance?.status) && (
                  <SignaturePopup
                    request={result.data?.clearance}
                    isPopupOpen={isSignaturePopupOpen}
                    onSuccess={() => {
                      setIsSignaturePopupOpen(false);
                      execute({ id, limit, skip });
                    }}
                    onClose={() => {
                      setIsSignaturePopupOpen(false);
                    }}
                  />
                )}
              </div>
            </div>
          </div>

          {result.data?.clearance?.status !== "created" && (
            <div className="w-full flex flex-col space-y-2">
              <div className="rounded-lg border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
                      Submitted By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p>
                        {result.data && result.data.clearance.submittedBy
                          ? result.data.clearance.submittedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.clearance.submittedAt
                          ? moment(result.data.clearance.submittedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : ""}
                      </p>
                      {result.data?.clearance?.submittedSignature && (
                        <div>
                          <img
                            src={result.data?.clearance?.submittedSignature}
                            className="w-[100px] h-[100px]"
                          />
                        </div>
                      )}
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
                        {result.data && result.data.clearance.budgetApprovedBy
                          ? result.data.clearance.budgetApprovedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.clearance.budgetApprovedAt
                          ? moment(
                              result.data.clearance.budgetApprovedAt
                            ).format("DD MMM YYYY HH:mm")
                          : ""}
                      </p>
                      {result.data?.clearance?.budgetApprovedSignature && (
                        <div>
                          <img
                            src={
                              result.data?.clearance?.budgetApprovedSignature
                            }
                            className="w-[100px] h-[100px]"
                          />
                        </div>
                      )}
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
                        {result.data && result.data.clearance.financeApprovedBy
                          ? result.data.clearance.financeApprovedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.clearance.financeApprovedAt
                          ? moment(
                              result.data.clearance.financeApprovedAt
                            ).format("DD MMM YYYY HH:mm")
                          : ""}
                      </p>
                      {result.data?.clearance?.financeApprovedSignature && (
                        <div>
                          <img
                            src={
                              result.data?.clearance?.financeApprovedSignature
                            }
                            className="w-[100px] h-[100px]"
                          />
                        </div>
                      )}
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
                        {result.data && result.data.clearance.completedBy
                          ? result.data.clearance.completedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.clearance.completedAt
                          ? moment(result.data.clearance.completedAt).format(
                              "DD MMM YYYY HH:mm"
                            )
                          : ""}
                      </p>
                      {result.data?.clearance?.completedSignature && (
                        <div>
                          <img
                            src={result.data?.clearance?.completedSignature}
                            className="w-[100px] h-[100px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="w-full flex flex-col space-y-2 mt-6 bg-gray-50 rounded-lg p-4 border border-border">
          <p className="text-sm text-black/50 font-[600]">Clearance Remarks</p>
          <p className="text-sm lg:mr-[20rem] mr-0">
            {result.data?.clearance?.remarks || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClearanceByIdPage; // Updated to ClearanceByIdPage
