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
import WorkplanForm from "../form";
import { getWorkplanByIdAction } from "@/actions/workplaneActions";
import { usePagination } from "@/hooks/use-pagination";
import { DataTable } from "../../activities/data-table";
import { columns } from "../../activities/columns";
import ActivityForm from "../../activities/form";
import WorkplanMiscPaymentForm from "../../workplan-misc-payments/form";
import { DataTable as WorkplanMiscPaymentDataTable } from "../../workplan-misc-payments/data-table";
import { columns as WorkplanMiscPaymentColumns } from "../../workplan-misc-payments/columns";
import { deleteWorkplanMiscPaymentAction } from "@/actions/workplaneMiscPaymentActions";
import { getRequestsForExportAction } from "@/actions/requestActions";
import { Button } from "@/components/ui/button";
import moment from "moment";
import { snakeToSentence } from "@/utils/snakeToSentence";

const WorkplanByIdPage = () => {
  const { id } = useParams();
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const { isPending, execute, result } = useAction(getWorkplanByIdAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();
  const [selectedActivity, setSelectedActivity] = useState();
  const [selectedWorkplanMiscPayment, setSelectedWorkplanMiscPayment] =
    useState();
  const {
    isPending: isDeleteWorkplanMiscPaymentPending,
    execute: deleteWorkplanMiscPayment,
  } = useAction(deleteWorkplanMiscPaymentAction);
  const [isExporting, setIsExporting] = useState(false);

  React.useEffect(() => {
    if (id) {
      execute({ id });
    }
  }, [id]);

  function exportToCSV(data) {
    // Define the CSV headers
    const headers = [
      "Request No.",
      "Type",
      "Title",
      "Budget Line",
      "Units/Departments",
      "Project",
      "Donor",
      "Status",
      "Status Note",
      "Total Requested",
      "Requested By",
      "Submitted By",
      "Budget Approved By",
      "Finance Approved By",
      "Payment Processed By",
      "Completed By",
      "Created At",
      "Updated At",
    ];

    // Map the data to a CSV-compliant array
    const rows = data.map((item) => [
      item.number,
      snakeToSentence(item.type),
      item.title,
      item.activity ? item.activity.code : "N/A",
      item.unit ? item.unit.name : "N/A",
      item.activity ? item.activity.project.code : "N/A",
      item.activity ? item.activity.project.donor.code : "N/A",
      item.status,
      item.statusNote,
      item.activity ? item.activity.budget : 0,
      item.createdBy ? item.createdBy.name : "N/A",
      item.submittedBy ? item.submittedBy.name : "N/A",
      item.budgetApprovedBy ? item.budgetApprovedBy.name : "N/A",
      item.financeApprovedBy ? item.financeApprovedBy.name : "N/A",
      item.paymentProcessedBy ? item.paymentProcessedBy.name : "N/A",
      item.completedBy ? item.completedBy.name : "N/A",
      moment(item.createdAt).format("DD/MM/YYYY HH:mm:ss"),
      moment(item.updatedAt).format("DD/MM/YYYY HH:mm:ss"),
    ]);

    // Combine headers and rows into a CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    // Create a Blob object with the CSV content
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

    // Create a link element to download the file
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "exported_data.csv");
    link.style.visibility = "hidden";

    // Append link to the body, trigger click, and remove it
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  const exportRequestAsCSV = async () => {
    setIsExporting(true);
    const requestsForExport = await getRequestsForExportAction(
      result.data.workplan.id
    );
    exportToCSV(requestsForExport);
    setIsExporting(false);
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
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 mt-4 gap-4">
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Total Projects</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.activities.length}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Budgeted</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.availableBudget
                ? `MVR ${result.data.availableBudget
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Used</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.totalRequestItemsAmount
                ? `MVR ${result.data.totalRequestItemsAmount
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
          <div className="bg-white border rounded-[--radius] p-4 mb-4">
            <h2 className="text-sm font-[400] opacity-50">Remaining</h2>
            <p className="text-lg font-bold">
              {result.data && result.data.remainingBudget
                ? `MVR ${result.data.remainingBudget
                    .toFixed(2)
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`
                : "MVR 0.00"}
            </p>
          </div>
        </div>
        <div className="w-full">
          <div className="w-full flex flex-row items-center justify-between pb-2">
            <h1 className="text-2xl font-semibold ">Activities</h1>
            {result.data && result.data.allProjects && (
              <ActivityForm
                activity={selectedActivity}
                workplan={result.data.workplan}
                projects={result.data.allProjects}
                onSuccess={() => {
                  setSelectedActivity();
                  execute({ id });
                }}
                onClose={() => {
                  setSelectedActivity();
                }}
              />
            )}
          </div>
          <DataTable
            columns={columns({
              onEdit: (activity) => {
                setSelectedActivity(activity);
              },
            })}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.activities
                ? result.data.activities
                : []
            }
            rowCount={result.data?.totalActivities || 0}
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
        <div className="w-full mt-6">
          <div className="w-full flex flex-row items-center justify-between pb-2">
            <h1 className="text-2xl font-semibold ">Misc Payments</h1>
            {result.data && result.data.workplan && (
              <WorkplanMiscPaymentForm
                activities={result.data.activities}
                workplanMiscPayment={selectedWorkplanMiscPayment}
                workplan={result.data.workplan}
                onSuccess={async () => {
                  setSelectedWorkplanMiscPayment();
                  await execute({ id });
                }}
                onClose={() => {
                  setSelectedWorkplanMiscPayment();
                }}
              />
            )}
          </div>
          <WorkplanMiscPaymentDataTable
            columns={WorkplanMiscPaymentColumns({
              onEdit: (workplanMiscPayment) => {
                setSelectedWorkplanMiscPayment(workplanMiscPayment);
              },
              onDelete: async (workplanMiscPayment) => {
                const confirmed = window.confirm(
                  "Are you sure you want to delete this payment?"
                );
                if (confirmed) {
                  await deleteWorkplanMiscPayment({
                    id: workplanMiscPayment.id,
                  });
                  await execute({ id });
                }
              },
            })}
            isPending={isPending}
            data={
              !isPending &&
              result.data &&
              result.data.workplan.workplanMiscPayments
                ? result.data.workplan.workplanMiscPayments
                : []
            }
            rowCount={result.data?.workplan?.totalWorkplanMiscPayments || 0}
          />
        </div>
        <div className="w-full flex flex-row items-center justify-end mt-6">
          <Button
            onClick={async () => {
              await exportRequestAsCSV();
            }}
            disabled={isExporting}
          >
            {isExporting ? "Exporting..." : "Export Requests"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WorkplanByIdPage; // Updated export
