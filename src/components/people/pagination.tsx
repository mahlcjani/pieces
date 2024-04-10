"use client";

import { Pagination as PaginationImpl } from "rsuite";
import { Pagination as MUIPagination } from "@mui/material";

import { useSearchParams, usePathname, useRouter } from "next/navigation";



/*
const NavLink = React.forwardRef((props, ref) => {
  const { href, active, eventKey, as, ...rest } = props;
  return (
    <Link
      href={`${location.pathname}?page=${eventKey}`}
      className={active ? "active" : null}
      as={as}
    >
      <a ref={ref} {...rest} />
    </Link>
  );
});
*/



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
    <>
      <PaginationImpl
        first prev next last ellipsis boundaryLinks
        size="md" maxButtons={3}
        linkAs={"button"}
        total={totalPages} limit={1} activePage={activePage} onChangePage={setActivePage}
      />
      {/*<MUIPagination count={totalPages} page={activePage} onChange={handleChange} />*/}
    </>
  );
}
