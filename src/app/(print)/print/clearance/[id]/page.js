"use client";

import { getClearanceByIdAction } from "@/actions/clearanceActions";
import LoadingIndicator from "@/components/ui/loading-indicator";
import { snakeToSentence } from "@/utils/snakeToSentence";
import moment from "moment";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const PrintClearancePage = () => {
  const { id } = useParams();
  const { isPending, execute, result } = useAction(getClearanceByIdAction);

  useEffect(() => {
    if (id) {
      execute({ id });
    }
  }, [id]);

  return (
    <>
      {isPending && (
        <div className="w-full h-screen flex flex-col items-center justify-center">
          <LoadingIndicator />
        </div>
      )}
      {result.data && (
        <div className="max-w-[800px] min-w-[800px] print-request py-6 w-full mx-auto bg-white">
          <header className="flex justify-start items-center gap-4 mb-4 border-b border-border pb-4">
            <div className="flex items-center">
              <img
                src="/mrclogo.png"
                alt="Maldivian Red Crescent"
                className="w-auto"
              />
            </div>
            <address className="text-left text-sm not-italic">
              <p className="font-bold text-lg">Maldivian Red Crescent</p>
              <p>
                2nd Floor, Plot number 11493, Hithigasmagu, Hulhumale', Maldives
              </p>
            </address>
          </header>
          <h1 className="text-xl font-semibold mb-6">
            Working Advance Clearance
          </h1>
          <div className="grid grid-cols-3 gap-x-12 gap-y-3 mb-6 text-sm">
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Clearance No.</span>
              <span>
                MRCC/{moment(result.data.clearance.number).format("YYYY")}/
                {result.data.clearance.number}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Request Type</span>
              <span>{snakeToSentence(result.data.clearance.request.type)}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Date</span>
              <span>
                {moment(result.data.clearance.request.submittedAt).format(
                  "DD MMM YYYY"
                )}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Budget Code</span>
              <span>{result.data.clearance.request.activity?.code}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Donor Code</span>
              <span>
                {result.data.clearance.request.activity?.project?.donor?.code}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Project Code</span>
              <span>
                {result.data.clearance.request.activity?.project?.code}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">
                Units/Departments
              </span>
              <span>{result.data.clearance.request?.unit?.name || "N/A"}</span>
            </div>
          </div>
          <table className="w-full mb-8 text-sm rounded-lg">
            <thead>
              <tr className="bg-gray-100 border border-border">
                <th className="border border-gray-300 p-2 text-left w-16">
                  No.
                </th>
                <th className="border border-gray-300 p-2 text-left">
                  Description
                </th>
                <th className="border border-gray-300 p-2 text-left w-20">
                  Qty
                </th>
                <th className="border border-gray-300 p-2 text-left w-24">
                  Rate
                </th>
                <th className="border border-gray-300 p-2 text-left w-24">
                  Amount
                </th>
                <th className="border border-gray-300 p-2 text-left w-24">
                  Expenditure
                </th>
                <th className="border border-gray-300 p-2 text-left w-24">
                  Payee
                </th>
                <th className="border border-gray-300 p-2 text-left w-24 whitespace-nowrap">
                  Expenditure Date
                </th>
              </tr>
            </thead>
            <tbody>
              {result.data.clearance.request.requestItems.map((item, index) => (
                <tr key={index} className="border border-gray-300">
                  <td className="border border-gray-300 p-2">{index + 1}</td>
                  <td className="border border-gray-300 p-2">
                    <div>{item.name}</div>
                    {item.remarks && (
                      <div className="text-xs mt-1">
                        <p className="text-black">Remarks : {item.remarks}</p>
                      </div>
                    )}
                  </td>
                  <td className="border border-gray-300 p-2">{item.qty}</td>
                  <td className="border border-gray-300 p-2">
                    {item.rate?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.amount?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {item.expenditure?.toFixed(2)}
                  </td>
                  <td className="border border-gray-300 p-2 whitespace-nowrap">
                    {item.payee}
                  </td>
                  <td className="border border-gray-300 p-2">
                    {moment(item.clearanceDate).format("DD MMM YYYY")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="grid grid-cols-3 gap-8 text-sm mt-12">
            <div className="space-y-1">
              <div className="font-[500]">Submitted By</div>
              <div>{result.data.clearance.submittedBy?.name}</div>
              <div>{result.data.clearance.submittedBy?.designation}</div>
              <div>
                {moment(result.data.clearance.request.submittedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data.clearance.submittedSignature && (
                <div>
                  <img
                    src={result.data.clearance.submittedSignature}
                    className="h-[100px]"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="font-[500]">Budget Approval</div>
              <div>{result.data.clearance.budgetApprovedBy?.name}</div>
              <div>{result.data.clearance.budgetApprovedBy?.designation}</div>
              <div>
                {moment(result.data.clearance.budgetApprovedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data.clearance.budgetApprovedSignature && (
                <div>
                  <img
                    src={result.data.clearance.budgetApprovedSignature}
                    className="h-[100px]"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="font-[500]">Finance Approval</div>
              <div>{result.data.clearance.financeApprovedBy?.name}</div>
              <div>{result.data.clearance.financeApprovedBy?.designation}</div>
              <div>
                {moment(result.data.clearance.financeApprovedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data.clearance.financeApprovedSignature && (
                <div>
                  <img
                    src={result.data.clearance.financeApprovedSignature}
                    className="h-[100px]"
                  />
                </div>
              )}
            </div>
          </footer>
        </div>
      )}
    </>
  );
};

export default PrintClearancePage;
