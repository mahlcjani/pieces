"use server"

import {
  AddChild,
  LinkChild,
  UnlinkChild
} from "@/components/people/buttons/children";

import {
  AddSpouse,
  EditSpouse,
  LinkSpouse,
  UnlinkSpouse
} from "./buttons/spouses";

import { type Person } from "@/lib/data.d";

import {
  fetchChildren,
  fetchParents,
  fetchSiblings,
  fetchSpouses
} from "@/lib/data";

import { formatDate4Form } from "@/lib/utils";

import {
  ButtonGroup,
  Link,
  Table
} from "@mui/joy";


/*
export function SpouseList({
  person,
  spouses
}: {
  person: Person,
  spouses: Person[],
  links: {
    open,
    edit,
    unlink,
    add,
    link
  }
}) {

}
  <SpouseList
    person={}
    spouses={}
    add={<AddSpouse person={person} />}
  />
*/

export async function Spouses({person}: {person: Person}) {
  const spouses = await fetchSpouses(person.id);
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Spouses
      </caption>
      <tbody>
      {spouses?.map((p) => (
        <tr key={p.id}>
          <td>
            <Link href={`/people/${p.id}`}>
              {p.firstName}
            </Link>
          </td>
          <td>{formatDate4Form(p.rel.beginDate)} - {formatDate4Form(p.rel.endDate)}</td>
          <td>{p.rel.endCause}</td>
          <td style={{textAlign: "right"}}>
            <EditSpouse person={person} spouse={p} />
            <UnlinkSpouse person={person} spouse={p} />
          </td>
        </tr>
      ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4}>
            <ButtonGroup spacing={1}>
              <AddSpouse person={person} />
              <LinkSpouse person={person} />
            </ButtonGroup>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export async function Children({person}: {person: Person}) {
  const children = await fetchChildren(person.id);
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Children
      </caption>
      <tbody>
      {children?.map((child) => (
        <tr key={child.id}>
          <td>
            <Link href={`/people/${child.id}`}>
              {child.firstName}
            </Link>
          </td>
          <td colSpan={2}>{formatDate4Form(child.birthDate)} - {formatDate4Form(child.deathDate)}</td>
          <td style={{textAlign: "right"}}>
            <UnlinkChild parent={person} child={child} />
          </td>
        </tr>
      ))}
      </tbody>
      <tfoot>
        <tr>
          <td colSpan={4}>
            <ButtonGroup spacing={1}>
              <AddChild parent={person} />
              <LinkChild parent={person} />
            </ButtonGroup>
          </td>
        </tr>
      </tfoot>
    </Table>
  );
}

export async function Parents({person}: {person: Person}) {
  const parents = await fetchParents(person.id);
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Parents
      </caption>
      <tbody>
      {parents?.map((p) => (
        <tr key={p.id}>
          <td>
            <Link href={`/people/${p.id}`}>
              {p.firstName}
            </Link>
          </td>
          <td colSpan={3}>{formatDate4Form(p.birthDate)} - {formatDate4Form(p.deathDate)}</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}

export async function Siblings({person}: {person: Person}) {
  const siblings = await fetchSiblings(person.id);
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Siblings
      </caption>
      <tbody>
      {siblings?.map((p) => (
        <tr key={p.id}>
          <td>
            <Link href={`/people/${p.id}`}>
              {p.firstName}
            </Link>
          </td>
          <td colSpan={3}>{formatDate4Form(p.birthDate)} - {formatDate4Form(p.deathDate)}</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}
