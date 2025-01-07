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
import ClearanceForm from "../form";
import { usePagination } from "@/hooks/use-pagination";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { DataTable } from "../../request-items/data-table";
import { getClearanceByIdAction } from "@/actions/clearanceActions";
import { columns } from "../../request-items/columns";
import SignaturePopup from "../signature-popup";
import UpdateExpenditureForm from "../../request-items/update-expenditure-form";
import RejectClearanceForm from "../reject-clearance";
import IncompleteClearanceForm from "../incomplete-clearance";
import { DataTable as ClearanceDocumentTable } from "../../clearance-documents/data-table";
import { columns as clearanceDocumentTableColumns } from "../../clearance-documents/columns";
import ClearanceDocumentForm from "../../clearance-documents/form";
import { getClearanceDocumentByIdAction } from "@/actions/clearanceDocumentActions";
import { useSession } from "next-auth/react";

const ClearanceByIdPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getClearanceByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [isSignaturePopupOpen, setIsSignaturePopupOpen] = useState(false);
  const [selectedRequestItem, setSelectedRequestItem] = useState(null);
  const [selectedClearanceDocument, setSelectedClearanceDocument] =
    useState(null);
  const {
    isPending: isClearanceDocumentPending,
    execute: executeClearanceDocument,
  } = useAction(getClearanceDocumentByIdAction);
  const { data: session } = useSession();
  const user = session?.user;

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
              Pending
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
                  <BreadcrumbPage>
                    {result.data && result.data.clearance
                      ? "MRCC/" +
                        moment(result.data.clearance.createdAt).format("YYYY") +
                        "/" +
                        result.data.clearance.number
                      : "Details"}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        <div className="w-full flex flex-col justify-between pb-4 capitalize">
          <div className="w-full flex flex-row items-center justify-between gap-4 mb-2">
            <div className="flex md:flex-row flex-col md:gap-3 gap-1 md:items-center items-start">
              <h1 className="text-2xl font-semibold">
                Working Advance Clearance
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
          {result.data?.clearance?.status === "rejected" && (
            <div>
              <div className="w-full flex flex-col space-y-1 my-2 bg-red-50 rounded-[--radius] p-4 border border-red-200">
                <p className="text-sm text-black/50 font-[600] text-red-500">
                  Reject Remarks
                </p>
                <p className="text-sm lg:mr-[20rem] mr-0 text-red-500">
                  {result.data?.clearance?.rejectedRemarks || "N/A"}
                </p>
              </div>
            </div>
          )}
          {result.data?.clearance?.incompleteRemarks && (
            <div>
              <div className="w-full flex flex-col space-y-1 my-2 bg-yellow-50 rounded-[--radius] p-4 border border-yellow-200">
                <p className="text-sm text-black/50 font-[600] text-yellow-600">
                  Incomplete Remarks
                </p>
                <p className="text-sm lg:mr-[20rem] mr-0 text-yellow-600">
                  {result.data?.clearance?.incompleteRemarks || "N/A"}
                </p>
              </div>
            </div>
          )}
          {result.data && result.data.clearance && (
            <div className="mt-4">
              <div className="w-full flex flex-col space-y-2">
                <div className="rounded-[--radius] border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
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
                showExpenditure: true,
                onExpenditureUpdate:
                  ["admin", "payment_processor", "finance_approver"].includes(
                    user?.role
                  ) || ["created"].includes(result.data?.clearance?.status)
                    ? (requestItem) => {
                        setSelectedRequestItem(requestItem);
                      }
                    : null,
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
              <div className="rounded-[--radius] border flex flex-col lg:flex-row overflow-hidden">
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
                        {result.data && result.data.totalExpenditure
                          ? result.data.totalExpenditure
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
                            result.data.totalExpenditure
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
                <Button
                  onClick={() => {
                    router.push(
                      `/print/clearance/${result.data?.clearance?.id}`
                    );
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
                  Print Clearance
                </Button>
              </div>
              <div>
                {[
                  "created",
                  "submitted",
                  "budget_approved",
                  "finance_approved",
                ].includes(result.data?.clearance?.status) && (
                  <SignaturePopup
                    request={result.data?.clearance}
                    user={user}
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
              <div className="rounded-[--radius] border grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 overflow-hidden">
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
                        {result.data &&
                        result.data.clearance.submittedDesignation
                          ? result.data.clearance.submittedDesignation
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
                            className="h-[100px]"
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
                        {result.data &&
                        result.data.clearance.budgetApprovedDesignation
                          ? result.data.clearance.budgetApprovedDesignation
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
                            className="h-[100px]"
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
                        {result.data &&
                        result.data.clearance.financeApprovedDesignation
                          ? result.data.clearance.financeApprovedDesignation
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
                            className="h-[100px]"
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
                        {result.data &&
                        result.data.clearance.completedDesignation
                          ? result.data.clearance.completedDesignation
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
                            className="h-[100px]"
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
        <div className="w-full flex flex-col space-y-2 mt-6 bg-gray-50 rounded-[--radius] p-4 border border-border">
          <p className="text-sm text-black/50 font-[600]">Clearance Remarks</p>
          <p className="text-sm lg:mr-[20rem] mr-0">
            {result.data?.clearance?.remarks || "N/A"}
          </p>
        </div>
        <div className="w-full">
          <div className="flex flex-row justify-between pb-6 pt-12">
            <p className="text-black text-xl font-[600]">Clearance Documents</p>
            {["admin", "payment_processor", "finance_approver"].includes(
              user?.role
            ) || ["created"].includes(result.data?.clearance?.status) ? (
              <ClearanceDocumentForm
                clearance={result.data?.clearance}
                clearanceDocument={selectedClearanceDocument}
                onSuccess={() => {
                  execute({ id, limit, skip });
                }}
                onClose={() => {}}
              />
            ) : (
              <></>
            )}
          </div>
          <div className="w-full">
            <ClearanceDocumentTable
              columns={clearanceDocumentTableColumns({
                onEdit:
                  ["admin", "payment_processor", "finance_approver"].includes(
                    user?.role
                  ) || ["created"].includes(result.data?.clearance?.status)
                    ? (clearanceDocument) => {
                        setSelectedClearanceDocument(clearanceDocument);
                      }
                    : null,
                onDelete:
                  ["admin", "payment_processor", "finance_approver"].includes(
                    user?.role
                  ) || ["created"].includes(result.data?.clearance?.status)
                    ? async (clearanceDocument) => {
                        const confirmed = window.confirm(
                          "Are you sure you want to delete this document?"
                        );
                        if (confirmed) {
                          await executeClearanceDocument({
                            id: clearanceDocument.id,
                          });
                          await execute({ id, limit, skip });
                        }
                      }
                    : null,
              })}
              isPending={isPending}
              data={
                !isPending &&
                result.data &&
                result.data.clearance.clearanceDocuments
                  ? result.data.clearance.clearanceDocuments
                  : []
              }
            />
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2 mt-6">
          {result.data &&
            result.data.clearance &&
            ["submitted", "budget_approved", "finance_approved"].includes(
              result.data?.clearance?.status
            ) &&
            (user?.role === "admin" ||
              user?.role === "budget_approver" ||
              user?.role === "finance_approver") && (
              <RejectClearanceForm
                clearance={result.data?.clearance}
                onSuccess={() => {
                  execute({ id, limit, skip });
                }}
                onClose={() => {}}
              />
            )}
          {result.data &&
            result.data.clearance &&
            [
              "submitted",
              "budget_approved",
              "finance_approved",
              "rejected",
            ].includes(result.data?.clearance?.status) &&
            (user?.role === "admin" ||
              user?.role === "budget_approver" ||
              user?.role === "finance_approver") && (
              <IncompleteClearanceForm
                clearance={result.data?.clearance}
                onSuccess={() => {
                  execute({ id, limit, skip });
                }}
                onClose={() => {}}
              />
            )}
        </div>
      </div>
      {(result.data &&
        result.data.clearance &&
        ["admin", "payment_processor", "finance_approver"].includes(
          user?.role
        )) ||
      ["created"].includes(result.data?.clearance?.status) ? (
        <UpdateExpenditureForm
          requestItem={selectedRequestItem}
          onSuccess={() => {
            setSelectedRequestItem(null);
            execute({ id, limit, skip });
          }}
          onClose={() => setSelectedRequestItem(null)}
        />
      ) : (
        <></>
      )}
    </div>
  );
};

export default ClearanceByIdPage; // Updated to ClearanceByIdPage
