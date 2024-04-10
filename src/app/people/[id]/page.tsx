"use server"

import ShowEditPerson from "@/components/people/person";

import {
  Children,
  Parents,
  Siblings,
  Spouses
} from "@/components/people/relatives";

import {
  fetchChildren,
  fetchParents,
  fetchPerson,
  fetchSiblings,
  fetchSpouses
} from "@/lib/data";

import {
  Breadcrumbs,
  Link,
  Stack,
  Typography,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  Divider
} from "@mui/joy";

type Params = {
  id: string;
}

type SearchParams = {
  query?: string;
  page?: number;
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const id = decodeURIComponent(params.id);

  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  const [person, spouses, children, parents, siblings] = await Promise.all([
    fetchPerson(id),
    fetchSpouses(id),
    fetchChildren(id),
    fetchParents(id),
    fetchSiblings(id)
  ]);

  console.log(person);

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <Link href={`/people?query=${query}&page=${page}`}>People</Link>
        <Typography>{person?.name}</Typography>
      </Breadcrumbs>

      { person && (
        <Tabs aria-label="Person info" defaultValue={0}>
          <TabList >
            <Tab>Personal data</Tab>
            <Tab>Family</Tab>
            <Tab>Social</Tab>
          </TabList>
          <TabPanel value={0}>
            <ShowEditPerson
              id={person.id}
              props={{
                name: person.name,
                firstName: person.firstName,
                surname: person.surname,
                birthDate: person.birthDate,
                birthName: person.birthName,
                deathDate: person.deathDate,
                nameDate: person.nameDate
              }}
            />
          </TabPanel>
          <TabPanel value={1}>
            <Stack spacing={1.5}>
              <Spouses person={person} spouses={spouses} />
              <Divider />
              <Children person={person} data={children} />
              { parents.length > 0 && (
                <>
                  <Divider />
                  <Parents person={person} parents={parents} />
                </>
              )}
              { siblings.length > 0 && (
                <>
                  <Divider />
                  <Siblings person={person} siblings={siblings} />
                </>
              )}
            </Stack>
          </TabPanel>
          <TabPanel value={2}>
            Later
          </TabPanel>
        </Tabs>
      )}
    </>
  )
}
