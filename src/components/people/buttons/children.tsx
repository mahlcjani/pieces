"use client"

import { AddPersonForm } from "../addPerson";

import { type Parentage, type Person } from "@/lib/actions/types";

import {
  createParentage,
  createPerson,
  deleteRel,
  suggestChildren
} from "@/lib/actions/people";

import {
  Button,
  FormControl,
  IconButton,
  Input,
  Link,
  Modal,
  ModalDialog,
  Table
} from "@mui/joy";

import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";

import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "@/lib/dayjs";

export function AddChild({parent}: {parent: Person}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function addChild(formData: FormData) {
    try {
      const child: Person|undefined = await createPerson(
        formData.get("sex")?.toString() ?? "Man",
        formData
      );
      if (child) {
        alert(`Person (${child.name}) record saved.`);

        await createParentage(parent.id, child.id);
        alert(`${parent.firstName} and ${child.firstName} are family.`);

        router.refresh();
        setOpen(false);
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)} data-testid="test-add-child">
        Add Child
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <AddPersonForm omitFields={["deathDate"]} onCreate={addChild} onClose={() => setOpen(false)} />
        </ModalDialog>
      </Modal>
    </>
  );
}

export function LinkChild({parent}: {parent: Person}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function linkChild(child: Person) {
    try {
      await createParentage(parent.id, child.id);
      alert(`${parent.firstName} and ${child.firstName} are family.`);

      router.refresh();
      setOpen(false);
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Link Child
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{minHeight: 400}}>
          <SuggestChildren parent={parent} onPersonClick={linkChild} />
        </ModalDialog>
      </Modal>
    </>
  );
}

export function UnlinkChild({parentage}: {parentage: Parentage}) {
  const router = useRouter();

  async function unlinkChild() {
    if (confirm(`Delete child relation with ${parentage.child.firstName}?`)) {
      try {
        await deleteRel(parentage.id);
        router.refresh();
      } catch (e: any) {
        console.log(e);
        alert(e.message);
      }
    }
  }

  return (
    <IconButton aria-label="Delete child" onClick={() => unlinkChild()}>
      <LinkOffOutlinedIcon />
    </IconButton>
  )
}

// Find Orphans
// Find Bachelors
// Find persons who can be child of given person
// - not child of the same sex person
// - born between person"s birth date (plus something) and death date

export function SuggestChildren({
  parent,
  onPersonClick
} : {
  parent: Person,
  onPersonClick: any
}) {
  const [query, setQuery] = useState(parent.surname);
  const [persons, setPersons] = useState<Person[]>([]);

  const queryChanged = useDebouncedCallback((query) => {
    setQuery(query);
  }, 300);

  useEffect(() => {
    search();
  }, [query]);

  async function search() {
    setPersons(
      await suggestChildren(
        query,
        parent.id,
        parent.sex,
        parent.birthDate,
        parent.deathDate
      )
    );
  }

  return (
    <>
      <FormControl>
        <Input
          id="query"
          onChange={(e) => { queryChanged(e.target.value) }}
          defaultValue={parent.surname}
        />
      </FormControl>

      <Table>
        <tbody>
        {persons?.map((p) => (
          <tr key={p.id}>
            <td>
              <Link onClick={() => onPersonClick({...p})}>
                {p.name ?? (p.surname + p.firstName)}
              </Link>
            </td>
            <td>{dayjs(p.birthDate).format("LL")}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}
