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
import RequestForm from "../form";
import { getRequestByIdAction } from "@/actions/requestActions";
import { usePagination } from "@/hooks/use-pagination";
import RequestItemForm from "../../request-items/form";
import { DataTable } from "../../request-items/data-table";
import { columns } from "../../request-items/columns";
import moment from "moment";
import { deleteRequestItemAction } from "@/actions/requestItemActions";
import { Button } from "@/components/ui/button";
import SignaturePopup from "../signature-popup";
import RejectRequestForm from "../reject-request";

const RequestByIdPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getRequestByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [selectedRequestItem, setSelectedRequestItem] = useState(null);
  const { isPending: isDeletePending, execute: deleteRequestItem } = useAction(
    deleteRequestItemAction
  );
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
                <BreadcrumbLink href="/app/requests">Requests</BreadcrumbLink>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {result.data && result.data.request
                      ? "MRCR/" +
                        moment(result.data.request.createdAt).format("YYYY") +
                        "/" +
                        result.data.request.number
                      : "Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex flex-row gap-2">
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
          <div className="w-full flex items-center justify-between gap-4 mb-2">
            <div className="flex md:flex-row flex-col md:gap-3 gap-1 md:items-center items-start">
              <h1 className="text-2xl font-semibold">
                {result.data && result.data.request
                  ? result.data.request.type + " request"
                  : "Request Details"}
              </h1>
              <div>{renderStatus(result.data?.request?.status)}</div>
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
          {result.data?.request?.status === "rejected" && (
            <div>
              <div className="w-full flex flex-col space-y-1 my-2 bg-red-50 rounded-[--radius] p-4 border border-red-200">
                <p className="text-sm text-black/50 font-[600] text-red-500">
                  Reject Remarks
                </p>
                <p className="text-sm lg:mr-[20rem] mr-0 text-red-500">
                  {result.data?.request?.rejectedRemarks || "N/A"}
                </p>
              </div>
            </div>
          )}
          {result.data && result.data.request && (
            <div className="mt-4">
              <div className="w-full flex flex-col space-y-2">
                <div className="rounded-[--radius] border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
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
              <div className="flex flex-row gap-2">
                {result.data &&
                  result.data.request &&
                  ["created"].includes(result.data?.request?.status) && (
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
                <div>
                  <Button
                    onClick={() => {
                      router.push(`/print/request/${result.data?.request?.id}`);
                    }}
                    className="bg-gray-100 text-black hover:bg-gray-200"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={24}
                      height={24}
                      color={"#000000"}
                      fill={"none"}
                    >
                      <path
                        d="M7.35396 18C5.23084 18 4.16928 18 3.41349 17.5468C2.91953 17.2506 2.52158 16.8271 2.26475 16.3242C1.87179 15.5547 1.97742 14.5373 2.18868 12.5025C2.36503 10.8039 2.45321 9.95455 2.88684 9.33081C3.17153 8.92129 3.55659 8.58564 4.00797 8.35353C4.69548 8 5.58164 8 7.35396 8H16.646C18.4184 8 19.3045 8 19.992 8.35353C20.4434 8.58564 20.8285 8.92129 21.1132 9.33081C21.5468 9.95455 21.635 10.8039 21.8113 12.5025C22.0226 14.5373 22.1282 15.5547 21.7352 16.3242C21.4784 16.8271 21.0805 17.2506 20.5865 17.5468C19.8307 18 18.7692 18 16.646 18"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      />
                      <path
                        d="M17 8V6C17 4.11438 17 3.17157 16.4142 2.58579C15.8284 2 14.8856 2 13 2H11C9.11438 2 8.17157 2 7.58579 2.58579C7 3.17157 7 4.11438 7 6V8"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M13.9887 16L10.0113 16C9.32602 16 8.98337 16 8.69183 16.1089C8.30311 16.254 7.97026 16.536 7.7462 16.9099C7.57815 17.1904 7.49505 17.5511 7.32884 18.2724C7.06913 19.3995 6.93928 19.963 7.02759 20.4149C7.14535 21.0174 7.51237 21.5274 8.02252 21.7974C8.40513 22 8.94052 22 10.0113 22L13.9887 22C15.0595 22 15.5949 22 15.9775 21.7974C16.4876 21.5274 16.8547 21.0174 16.9724 20.4149C17.0607 19.963 16.9309 19.3995 16.6712 18.2724C16.505 17.5511 16.4218 17.1904 16.2538 16.9099C16.0297 16.536 15.6969 16.254 15.3082 16.1089C15.0166 16 14.674 16 13.9887 16Z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18 12H18.009"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Print Request
                  </Button>
                </div>
              </div>
              <div>
                {[
                  "created",
                  "submitted",
                  "budget_approved",
                  "finance_approved",
                  "payment_processing",
                ].includes(result.data?.request?.status) && (
                  <SignaturePopup
                    request={result.data?.request}
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
          {result.data?.request?.status !== "created" && (
            <div className="w-full flex flex-col space-y-2">
              <div className="rounded-[--radius] border grid lg:grid-cols-5 md:grid-cols-2 grid-cols-1 overflow-hidden">
                <div className="w-full">
                  <div>
                    <p className="text-black/50 text-sm border-b border-t border-t-transparent border-border py-3 font-[600] px-4 bg-gray-50">
                      Submitted By
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p className="font-[600]">
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
                      {result.data?.request?.submittedSignature && (
                        <div>
                          <img
                            src={result.data?.request?.submittedSignature}
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
                      <p className="font-[600]">
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
                      {result.data?.request?.budgetApprovedSignature && (
                        <div>
                          <img
                            src={result.data?.request?.budgetApprovedSignature}
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
                      <p className="font-[600]">
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
                      {result.data?.request?.financeApprovedSignature && (
                        <div>
                          <img
                            src={result.data?.request?.financeApprovedSignature}
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
                      Payment Processing
                    </p>
                    <div className="py-3 px-4 text-sm flex flex-col gap-1">
                      <p className="font-[600]">
                        {result.data && result.data.request.paymentProcessedBy
                          ? result.data.request.paymentProcessedBy.name
                          : ""}
                      </p>
                      <p>
                        {result.data && result.data.request.paymentProcessedAt
                          ? moment(
                              result.data.request.paymentProcessedAt
                            ).format("DD MMM YYYY HH:mm")
                          : ""}
                      </p>
                      {result.data?.request?.paymentProcessedSignature && (
                        <div>
                          <img
                            src={
                              result.data?.request?.paymentProcessedSignature
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
                      <p className="font-[600]">
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
                      {result.data?.request?.completedSignature && (
                        <div>
                          <img
                            src={result.data?.request?.completedSignature}
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
          <div className="w-full flex flex-col space-y-2 mt-6 bg-gray-50 rounded-[--radius] p-4 border border-border">
            <p className="text-sm text-black/50 font-[600]">Request Remarks</p>
            <p className="text-sm lg:mr-[20rem] mr-0">
              {result.data?.request?.remarks || "N/A"}
            </p>
          </div>
          {result.data &&
            result.data.request &&
            ["submitted", "budget_approved", "finance_approved"].includes(
              result.data?.request?.status
            ) && (
              <div className="w-full flex flex-row justify-end gap-2 mt-6">
                <RejectRequestForm
                  request={result.data?.request}
                  onSuccess={() => {
                    execute({ id, limit, skip });
                  }}
                  onClose={() => {}}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default RequestByIdPage; // Updated to RequestByIdPage
