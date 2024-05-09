"use client"

import {
  AddChild,
  LinkChild,
  UnlinkChild
} from "@/components/people/buttons/children";

import {
  AddSpouse,
  EditMarriage,
  LinkSpouse,
  UnlinkSpouse
} from "./buttons/spouses";

import {
  type Marriage,
  type Parentage,
  type Person
} from "@/lib/actions/types";

import { formatDate } from "@/lib/utils";

import { Anchor, Group, Table, Text } from "@mantine/core";


export function Marriages({person, records}: {person: Person, records: Marriage[]}) {
  const rows = records?.map((rel) => (
    <Table.Tr key={rel.id}>
      <Table.Td>
        <Anchor href={`/people/${(person.sex === "Man" ? rel.wife : rel.husband).id}`}>
          {(person.sex === "Man" ? rel.wife : rel.husband).firstName}
        </Anchor>
      </Table.Td>
      <Table.Td>
        {formatDate(rel.beginDate)} - {formatDate(rel.endDate)}
      </Table.Td>
      <Table.Td>
        {rel.endCause}
      </Table.Td>
      <Table.Td style={{textAlign: "right"}}>
        <EditMarriage person={person} marriage={rel} />
        <UnlinkSpouse person={person} marriage={rel} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <>
      <Text size="lg">
        Marriages
        <Group>
          <Anchor href="">[+]</Anchor>
          <Anchor href="">[~]</Anchor>
        </Group>
      </Text>
      <Table captionSide="top">
        <Table.Tbody>{rows}</Table.Tbody>
        <Table.Tfoot>
          <Table.Tr>
            <Table.Td colSpan={4}>
              <Group gap={"sm"}>
                <AddSpouse person={person} />
                <LinkSpouse person={person} />
              </Group>
            </Table.Td>
          </Table.Tr>
        </Table.Tfoot>
      </Table>
    </>
  );
}

export function Children({person, records}: {person: Person, records: Parentage[]}) {
  const rows = records?.map((rel) => (
    <Table.Tr key={rel.id}>
      <Table.Td>
        <Anchor href={`/people/${rel.child.id}`}>
          {rel.child.firstName}
        </Anchor>
      </Table.Td>
      <Table.Td colSpan={2}>
        {formatDate(rel.child.birthDate)} - {formatDate(rel.child.deathDate)}
      </Table.Td>
      <Table.Td style={{textAlign: "right"}}>
        <UnlinkChild parentage={rel} />
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table captionSide="top">
      <Table.Caption style={{fontWeight: "bold", textAlign: "left"}}>Children</Table.Caption>
      <Table.Tbody>{rows}</Table.Tbody>
      <Table.Tfoot>
        <Table.Tr>
          <Table.Td colSpan={4}>
            <Group>
              <AddChild parent={person} />
              <LinkChild parent={person} />
            </Group>
          </Table.Td>
        </Table.Tr>
      </Table.Tfoot>
    </Table>
  );
}

export function Parents({person, records}: {person: Person, records: Parentage[]}) {
  const rows = records?.map((rel) => (
    <Table.Tr key={rel.id}>
      <Table.Td>
        <Anchor href={`/people/${rel.parent.id}`}>
          {rel.parent.firstName}
        </Anchor>
      </Table.Td>
      <Table.Td colSpan={3}>
        {formatDate(rel.parent.birthDate)} - {formatDate(rel.parent.deathDate)}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table captionSide="top">
      <Table.Caption style={{fontWeight: "bold", textAlign: "left"}}>Parents</Table.Caption>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}

export function Siblings({person, siblings}: {person: Person, siblings: Person[]}) {
  const rows = siblings?.map((p) => (
    <Table.Tr key={p.id}>
      <Table.Td>
        <Anchor href={`/people/${p.id}`}>
          {p.firstName}
        </Anchor>
      </Table.Td>
      <Table.Td colSpan={3}>
        {formatDate(p.birthDate)} - {formatDate(p.deathDate)}
      </Table.Td>
    </Table.Tr>
  ));
  return (
    <Table captionSide="top">
      <Table.Caption style={{fontWeight: "bold", textAlign: "left"}}>Siblings</Table.Caption>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
  );
}
