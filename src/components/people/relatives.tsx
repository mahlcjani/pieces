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

import { formatDate4Form } from "@/lib/utils";

import {
  ButtonGroup,
  Link,
  Table
} from "@mui/joy";

export function Marriages({person, records}: {person: Person, records: Marriage[]}) {
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Spouses
      </caption>
      <tbody>
      {records?.map((r) => (
        <tr key={r.id}>
          <td>
            <Link href={`/people/${(person.sex === "Man" ? r.wife : r.husband).id}`}>
              {(person.sex === "Man" ? r.wife : r.husband).firstName}
            </Link>
          </td>
          <td>{formatDate4Form(r.beginDate)} - {formatDate4Form(r.endDate)}</td>
          <td>{r.endCause}</td>
          <td style={{textAlign: "right"}}>
            <EditMarriage person={person} marriage={r} />
            <UnlinkSpouse person={person} marriage={r} />
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

export function Children({person, records}: {person: Person, records: Parentage[]}) {
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Children
      </caption>
      <tbody>
      {records?.map((rel) => (
        <tr key={rel.id}>
          <td>
            <Link href={`/people/${rel.child.id}`}>
              {rel.child.firstName}
            </Link>
          </td>
          <td colSpan={2}>{formatDate4Form(rel.child.birthDate)} - {formatDate4Form(rel.child.deathDate)}</td>
          <td style={{textAlign: "right"}}>
            <UnlinkChild parentage={rel} />
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

export function Parents({person, records}: {person: Person, records: Parentage[]}) {
  return (
    <Table>
      <caption style={{fontWeight: "bold", textAlign: "left"}}>
        Parents
      </caption>
      <tbody>
      {records?.map((rel) => (
        <tr key={rel.id}>
          <td>
            <Link href={`/people/${rel.parent.id}`}>
              {rel.parent.firstName}
            </Link>
          </td>
          <td colSpan={3}>{formatDate4Form(rel.parent.birthDate)} - {formatDate4Form(rel.parent.deathDate)}</td>
        </tr>
      ))}
      </tbody>
    </Table>
  );
}

export function Siblings({person, siblings}: {person: Person, siblings: Person[]}) {
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
