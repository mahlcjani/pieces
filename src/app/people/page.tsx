"use server"

import AddPerson from "@/components/people/addPersonButton";
import Pagination from "@/components/people/pagination";
import Search from "@/components/people/search";
import Table from "@/components/people/table";

import { countPeople } from "@/lib/actions/people";

import {
  Box,
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from "@mui/joy";

export default async function Page({
  searchParams,
}: {
  searchParams?: {
    query?: string;
    page?: string;
  };
}) {
  const query = searchParams?.query || "";
  const currentPage = Number(searchParams?.page) || 1;

  console.log(`people page: query=${query}, page=${currentPage}`)

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(Number(await countPeople(query)) / ITEMS_PER_PAGE);

  return (
    <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
      <Breadcrumbs aria-label="breadcrumb" sx={{boxShadow: 1}}>
        <Link href="/">Home</Link>
        <Typography>People</Typography>
      </Breadcrumbs>

      <Stack direction="row" spacing={1} sx={{margin: 1}}>
        <Search placeholder="Search people..." />
        <AddPerson />
      </Stack>

      <div style={{flex: 1}}>
        <Table
          query={query}
          currentPage={currentPage}
          pageSize={ITEMS_PER_PAGE}
        />
      </div>

      <div style={{alignSelf: "center"}}>
        <Pagination activePage={currentPage} totalPages={totalPages} />
      </div>

      {/*
      <Suspense key={query + currentPage} fallback={<PeopleTableSkeleton />}>
        <Table query={query} currentPage={currentPage} totalPages={totalPages} pageSize={ITEMS_PER_PAGE} />
      </Suspense>
      */}
    </div>
  );
}
