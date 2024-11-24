"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import React, { useEffect, useState } from "react";
import { useAction } from "next-safe-action/hooks";
import DonorForm from "./form";
import { getDonorsAction } from "@/actions/donorActions";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { DotIcon, MenuIcon, TrashIcon, ViewIcon } from "lucide-react";
import Link from "next/link";

const BudgetPage = () => {
  const [selectedDonor, setSelectedDonor] = useState();
  const { isPending, execute, result } = useAction(getDonorsAction);

  useEffect(() => {
    execute();
  }, []);

  return (
    <div className="w-full h-full">
      <div className="w-full flex items-center justify-between px-4 py-4 border-b sticky top-0 bg-background h-[66px]">
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
                <BreadcrumbItem>
                  <BreadcrumbPage>Donors</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <DonorForm
                donor={selectedDonor}
                onClose={() => setSelectedDonor(null)}
                onSuccess={() => {
                  execute();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full p-4">
        {isPending && <div>Loading...</div>}
        {result && result.data && result.data.donors && (
          <>
            <div className="w-full flex flex-col pb-4">
              <h1 className="text-2xl font-semibold ">Donors</h1>
              <p className="text-md text-black/50">
                All the requests that has been submitted
              </p>
            </div>
            <div className="overflow-x-auto rounded-xl border-collapse border">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap">
                      #
                    </th>
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap">
                      Code
                    </th>
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap">
                      Created At
                    </th>
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap">
                      Updated At
                    </th>
                    <th className="px-6 py-3 text-left text-black whitespace-nowrap"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {result?.data?.donors?.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-4">
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="w-[32px] h-[32px] mb-1">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="32"
                              height="32"
                              fill="#000000"
                              viewBox="0 0 256 256"
                            >
                              <path
                                d="M215.46,216H40.54C27.92,216,20,202.79,26.13,192.09L113.59,40.22c6.3-11,22.52-11,28.82,0l87.46,151.87C236,202.79,228.08,216,215.46,216Z"
                                opacity="0.2"
                              ></path>
                              <path d="M236.8,188.09,149.35,36.22h0a24.76,24.76,0,0,0-42.7,0L19.2,188.09a23.51,23.51,0,0,0,0,23.72A24.35,24.35,0,0,0,40.55,224h174.9a24.35,24.35,0,0,0,21.33-12.19A23.51,23.51,0,0,0,236.8,188.09ZM222.93,203.8a8.5,8.5,0,0,1-7.48,4.2H40.55a8.5,8.5,0,0,1-7.48-4.2,7.59,7.59,0,0,1,0-7.72L120.52,44.21a8.75,8.75,0,0,1,15,0l87.45,151.87A7.59,7.59,0,0,1,222.93,203.8ZM120,144V104a8,8,0,0,1,16,0v40a8,8,0,0,1-16,0Zm20,36a12,12,0,1,1-12-12A12,12,0,0,1,140,180Z"></path>
                            </svg>
                          </div>
                          <p className="text-md font-semibold text-black">
                            No donors found.
                          </p>
                          <p className="text-sm text-black/50">
                            Create a donor to start accepting requests.
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    result.data.donors.map((donor, index) => (
                      <tr key={donor.id} className="transition duration-200">
                        <td className="px-6 py-3 whitespace-nowrap">
                          {index + 1}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {donor.code}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {donor.name}
                        </td>

                        <td className="px-6 py-3 whitespace-nowrap">
                          {moment(donor.createdAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap">
                          {moment(donor.updatedAt).format("DD/MM/YYYY")}
                        </td>
                        <td className="px-6 py-3 whitespace-nowrap flex gap-2 justify-end">
                          <div
                            onClick={() => setSelectedDonor(donor)}
                            // href={`/app/donors/${donor.id}`}
                            className="h-[28px] px-3 bg-black rounded-md text-white flex items-center justify-center text-sm"
                          >
                            View
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BudgetPage;
