"use client"

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

import { useEffect, useRef, useState } from "react";

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

/*
await fetch(url, {
  method: "POST", // *GET, POST, PUT, DELETE, etc.
  mode: "cors", // no-cors, *cors, same-origin
  cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
  credentials: "same-origin", // include, *same-origin, omit
  headers: {
    "Content-Type": "application/json",
    // 'Content-Type': 'application/x-www-form-urlencoded',
  },
  redirect: "follow", // manual, *follow, error
  referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
  body: JSON.stringify(data), // body data type must match "Content-Type" header
});
*/

export function Spouses({person}: {person: Person}) {
  const [spouses, setSpouses] = useState<Person[]>([]);

  const didMount = useRef(false);
/*
  useEffect(() => {
    if (didMount.current) {
      fetch(`${window.location.origin}/api/v1/people/${person.id}/spouses`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setSpouses(response);
      });
    } else {
      didMount.current = true;
    }
  }, []);
*/

  useEffect(() => {
    if (didMount.current) {
      (async () => {
        setSpouses(await fetchSpouses(person.id));
      })();
    } else {
      didMount.current = true;
    }
  }, []);

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

export function Children({person}: {person: Person}) {
  const [children, setChildren] = useState<Person[]>([]);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      fetch(`${window.location.origin}/api/v1/people/${person.id}/children`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setChildren(response);
      });
    } else {
      didMount.current = true;
    }
  }, []);

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

export function Parents({person}: {person: Person}) {
  const [parents, setParents] = useState<Person[]>([]);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      fetch(`${window.location.origin}/api/v1/people/${person.id}/parents`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setParents(response);
      });
    } else {
      didMount.current = true;
    }
  }, []);

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

export function Siblings({person}: {person: Person}) {
  const [siblings, setSiblings] = useState<Person[]>([]);

  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) {
      fetch(`${window.location.origin}/api/v1/people/${person.id}/siblings`)
      .then((response) => {
        console.log(response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((response) => {
        console.log(response);
        setSiblings(response);
      });
    } else {
      didMount.current = true;
    }
  }, []);

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
