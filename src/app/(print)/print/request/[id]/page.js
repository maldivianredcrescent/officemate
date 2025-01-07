"use client";

import { getRequestByIdAction } from "@/actions/requestActions";
import moment from "moment";
import { useAction } from "next-safe-action/hooks";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";

const PrintRequestPage = () => {
  const { id } = useParams();
  const { isPending, execute, result } = useAction(getRequestByIdAction);

  useEffect(() => {
    if (id) {
      execute({ id });
    }
  }, [id]);

  return (
    <>
      {isPending && <div className="text-center py-4">Loading...</div>}
      {result.data && (
        <div className="max-w-[800px] print-request py-6 w-full mx-auto bg-white">
          <header className="flex justify-between items-start mb-4 border-b border-border pb-4">
            <div className="flex items-center">
              <img
                src="/mrclogo.png"
                alt="Maldivian Red Crescent"
                className="h-12"
              />
            </div>
            <address className="text-left text-sm not-italic">
              2nd Floor, Plot number 11493,
              <br />
              Hithigasmagu, Hulhumale',
              <br />
              Maldives
            </address>
          </header>
          <h1 className="text-xl font-semibold mb-6">Request Form</h1>
          <div className="grid grid-cols-3 gap-x-12 gap-y-3 mb-6 text-sm">
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Date</span>
              <span>
                {moment(result.data.request.createdAt).format("DD MMM YYYY")}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Activity</span>
              <span>{result.data.request.activity?.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Activity Code</span>
              <span>{result.data.request.activity?.code}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Request No.</span>
              <span>
                MRCR/{moment(result.data.request.createdAt).format("YYYY")}/
                {result.data.request.number}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Project</span>
              <span>{result.data.request.activity?.project?.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Project Code</span>
              <span>{result.data.request.activity?.project?.code}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">
                Units/Departments
              </span>
              <span>{result.data.request?.unit?.name || "N/A"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Donor</span>
              <span>{result.data.request.activity?.project?.donor?.name}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-[400] text-black/70">Donor Code</span>
              <span>{result.data.request.activity?.project?.donor?.code}</span>
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
              </tr>
            </thead>
            <tbody>
              {result.data.request.requestItems.map((item, index) => (
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
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="grid grid-cols-3 gap-8 text-sm mt-12">
            <div className="space-y-1">
              <div className="font-[500]">Submitted By</div>
              <div>{result.data.request.submittedBy?.name}</div>
              <div>{result.data.request.submittedBy?.designation}</div>
              <div>
                {moment(result.data.request.submittedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data?.request?.submittedSignature && (
                <div>
                  <img
                    src={result.data?.request?.submittedSignature}
                    className="h-[100px]"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="font-[500]">Budget Approval</div>
              <div>{result.data.request.budgetApprovedBy?.name}</div>
              <div>{result.data.request.budgetApprovedBy?.designation}</div>
              <div>
                {moment(result.data.request.budgetApprovedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data?.request?.budgetApprovedSignature && (
                <div>
                  <img
                    src={result.data?.request?.budgetApprovedSignature}
                    className="h-[100px]"
                  />
                </div>
              )}
            </div>
            <div className="space-y-1">
              <div className="font-[500]">Finance Approval</div>
              <div>{result.data.request.financeApprovedBy?.name}</div>
              <div>{result.data.request.financeApprovedBy?.designation}</div>
              <div>
                {moment(result.data.request.financeApprovedAt).format(
                  "DD MMM YYYY HH:mm"
                )}
              </div>
              {result.data?.request?.financeApprovedSignature && (
                <div>
                  <img
                    src={result.data?.request?.financeApprovedSignature}
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

export default PrintRequestPage;
