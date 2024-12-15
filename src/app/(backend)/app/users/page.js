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
import UserForm from "./form";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { usePagination } from "@/hooks/use-pagination";
import { getUsersAction } from "@/actions/usersActions";

const UsersPage = () => {
  const [selectedUser, setSelectedUser] = useState();
  const { isPending, execute, result } = useAction(getUsersAction);
  const { limit, skip, pagination, onPaginationChange } = usePagination();

  useEffect(() => {
    execute({
      skip: skip,
      limit: limit,
    });
  }, [pagination]);

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
                <BreadcrumbItem>
                  <BreadcrumbPage>Users</BreadcrumbPage>{" "}
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div>
              <UserForm
                user={selectedUser}
                onClose={() => setSelectedUser(null)}
                onSuccess={() => {
                  execute({
                    skip: skip,
                    limit: limit,
                  });
                  setSelectedUser(null);
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-full px-4">
        <div className="w-full">
          <DataTable
            columns={columns((user) => {
              setSelectedUser(user);
            })}
            isPending={isPending}
            data={
              !isPending && result.data && result.data.users // Updated to result.data.users
                ? result.data.users
                : []
            }
            rowCount={result.data?.totalUsers || 0} // Updated to totalUsers
            onPaginationChange={onPaginationChange}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default UsersPage; // Updated to UsersPage
