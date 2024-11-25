import { useState } from "react";

export function usePagination() {
  const [pagination, setPagination] = useState({
    pageSize: 20,
    pageIndex: 0,
  });
  const { pageSize, pageIndex } = pagination;

  return {
    limit: pageSize,
    onPaginationChange: setPagination,
    pagination,
    skip: pageIndex * pageSize,
  };
}
