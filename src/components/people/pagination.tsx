"use client";

import { Pagination as MantinePagination } from "@mantine/core";
import { useSearchParams, usePathname, useRouter } from "next/navigation";

export default function Pagination({ activePage, totalPages }: { activePage: number, totalPages: number }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { replace } = useRouter();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const setActivePage = (pageNumber: number | string) => {
    replace(createPageURL(pageNumber));
  };

  return (
    <MantinePagination
      withControls={true}
      withEdges={true}
      total={totalPages}
      value={activePage}
      onChange={setActivePage}
      size="sm"
      mt="sm"
    />
  );
}
