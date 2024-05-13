"use client"

import { AddPersonForm } from "../person";
import { type Parentage, type Person } from "@/lib/actions/types";

import {
  createParentage,
  deleteRel,
  suggestChildren
} from "@/lib/actions/people";

import {
  ActionIcon,
  Anchor,
  Button,
  Modal,
  Table,
  Text,
  TextInput
} from "@mantine/core";

import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { IconTrash } from "@tabler/icons-react";

import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import dayjs from "@/lib/dayjs";

export function AddChild({parent}: {parent: Person}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function childCreated(child: Person) {
    try {
      await createParentage(parent.id, child.id);
      alert(`${parent.firstName} and ${child.firstName} are family.`);
      router.refresh();
      close();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <>
      <Button onClick={open}>
        Add Child
      </Button>
      <Modal
        role="dialog"
        title="New person"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <AddPersonForm omitFields={["nameDate"]} onCreate={childCreated} />
      </Modal>
    </>
  );
}

export function LinkChild({parent}: {parent: Person}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function linkChild(child: Person) {
    try {
      await createParentage(parent.id, child.id);
      alert(`${parent.firstName} and ${child.firstName} are family.`);
      router.refresh();
      close();
    } catch (e: any) {
      alert(e.message);
    }
  }

  return (
    <>
      <Button onClick={open}>
        Link Child
      </Button>
      <Modal
        role="dialog"
        title="Find child"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <SuggestChildren parent={parent} onPersonClick={linkChild} />
      </Modal>
    </>
  );
}

export function UnlinkChild({parentage}: {parentage: Parentage}) {
  const router = useRouter();

  function confirmDelete() {
    modals.openConfirmModal({
      title: "Delete parent-child relation",
      withCloseButton: false,
      children: (
        <Text size="sm">
          Are you sure you want to delete child relation with {parentage.child.firstName}?
        </Text>
      ),
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { color: "red" },
      onConfirm: () => unlinkChild()
    });
  }

  async function unlinkChild() {
    try {
      await deleteRel(parentage.id);
      router.refresh();
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <ActionIcon aria-label="Delete" onClick={confirmDelete} variant="transparent">
      <IconTrash />
    </ActionIcon>
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
      <TextInput
        id="query"
        onChange={(e) => { queryChanged(e.target.value) }}
        defaultValue={query}
      />
      <Table>
        <Table.Tbody>
        {persons?.map((p) => (
          <Table.Tr key={p.id}>
            <Table.Td>
              <Anchor onClick={() => onPersonClick({...p})}>
                {p.name}
              </Anchor>
            </Table.Td>
            <Table.Td>{dayjs(p.birthDate).format("ll")}</Table.Td>
          </Table.Tr>
        ))}
        </Table.Tbody>
      </Table>
    </>
  );
}
