"use server"

import ShowEditPerson from "@/components/people/person";

import {
  Children,
  Parents,
  Siblings,
  Marriages
} from "@/components/people/relatives";

import {
  fetchChildren,
  fetchMarriages,
  fetchParents,
  fetchPerson,
  fetchSiblings
} from "@/lib/actions/people";

import {
  Anchor,
  Breadcrumbs,
  Container,
  NavLink,
  Tabs,
  // Workaround for nextjs issues with using Tabs.List, Tabs.Tab and Tabs.Panel
  TabsList, TabsPanel, TabsTab,
  Text
} from '@mantine/core';

type Params = {
  id: string;
}

type SearchParams = {
  query?: string;
  page?: number;
}

export default async function Person({
  params,
  searchParams,
}: {
  params: Params;
  searchParams?: SearchParams;
}) {
  const id = decodeURIComponent(params.id);

  const query = searchParams?.query || "";
  const page = Number(searchParams?.page) || 1;

  const [person, marriages, children, parents, siblings] = await Promise.all([
    fetchPerson(id),
    fetchMarriages(id),
    fetchChildren(id),
    fetchParents(id),
    fetchSiblings(id)
  ]);

  return (
    <>

      <Breadcrumbs m="md">
        <Anchor key="home" href="/" size="lg">Home</Anchor>
        <Anchor key="people" href={`/people?query=${query}&page=${page}`} size="lg">People</Anchor>
        <Text size="lg">{person?.name}</Text>
      </Breadcrumbs>

      { person && (
        <Tabs aria-label="Person info" defaultValue="personalia">
          <TabsList grow={true}>
            <TabsTab value="personalia">Personal data</TabsTab>
            <TabsTab value="family">Family</TabsTab>
            <TabsTab value="social" disabled>Social</TabsTab>
          </TabsList>
          <TabsPanel value="personalia">
            <Container fluid mt="md">
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
            </Container>
          </TabsPanel>
          <TabsPanel value="family">
              <Marriages person={person} records={marriages} />
              <Children person={person} records={children} />
              { parents.length > 0 && (
                <>
                  <Parents person={person} records={parents} />
                </>
              )}
              { siblings.length > 0 && (
                <>
                  <Siblings person={person} siblings={siblings} />
                </>
              )}
          </TabsPanel>
          <TabsPanel value="social">
            <Container fluid mt="md">
              Later
            </Container>
          </TabsPanel>
        </Tabs>
      )}
    </>
  )
}
