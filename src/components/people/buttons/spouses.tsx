"use client"

import { AddPersonForm } from "../person";
import { Marriage, type Person } from "@/lib/actions/types";
import {
  createMarriage,
  deleteRel,
  suggestSpouses,
  updateMarriage,
} from "@/lib/actions/people";

import dayjs from "@/lib/dayjs";

import {
  ActionIcon,
  Anchor,
  Button,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Table,
  Text,
  TextInput
} from "@mantine/core";


import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';

import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AddSpouse({person}: {person: Person}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function spouseCreated(spouse: Person) {
    try {
      await createMarriage(person.id, spouse.id, new FormData());
      alert(`${person.firstName} and ${spouse.firstName} are family.`);
      router.refresh();
      close();
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Button onClick={open} variant="light">
        Add Spouse
      </Button>
      <Modal
        role="dialog"
        title="New person"
        opened={opened}
        onClose={close}
        withinPortal={true}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <AddPersonForm sex={person.sex == "Man" ? "Woman" : "Man"} omitFields={["nameDate"]} onCreate={spouseCreated} />
      </Modal>
    </>
  );
}

export function LinkSpouse({person}: {person: Person}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function linkSpouse(spouse: Person) {
    try {
      await createMarriage(person.id, spouse.id, new FormData());
      alert(`${person.firstName} and ${spouse.firstName} are family.`);
      router.refresh();
      close();
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Button onClick={open} variant="light">
        Link Spouse
      </Button>
      <Modal
        role="dialog"
        title="Find spouse"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <SuggestSpouses person={person} onPersonClick={linkSpouse} />
      </Modal>
    </>
  );
}

export function UnlinkSpouse({person, marriage}: {person: Person, marriage: Marriage}) {
  const router = useRouter();

  function confirmDelete() {
    modals.openConfirmModal({
      title: "Delete marriage",
      withCloseButton: false,
      children: (
        <Text size="sm">
          Are you sure you want to delete marriage of {marriage.wife.firstName} and {marriage.husband.firstName}?
        </Text>
      ),
      labels: { confirm: "Yes", cancel: "No" },
      confirmProps: { color: "red" },
      onConfirm: () => unlinkSpouse()
    });
  }

  async function unlinkSpouse() {
    try {
      await deleteRel(marriage.id);
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

export function EditMarriage({person, marriage}: {person: Person, marriage: Marriage}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function submitForm(formData: FormData) {
    try {
      await updateMarriage(marriage.id, formData);

      router.refresh();
      close();
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <ActionIcon aria-label="Edit details" onClick={open} variant="transparent">
        <IconEdit />
      </ActionIcon>
      <Modal
        title="Edit marriage"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
          <form>
            <Stack>
              <DatePickerInput
                name="beginDate"
                label="Begin date"
                required
                defaultValue={marriage?.beginDate ? dayjs(marriage?.beginDate).toDate() : null}
                size="md"
              />
              <DatePickerInput
                name="endDate"
                label="End date"
                clearable
                defaultValue={marriage?.endDate ? dayjs(marriage?.endDate).toDate() : null}
                size="md"
              />
              <Select
                name="endCause"
                label="End cause"
                data={[
                  { value: "Death", label: "Death" },
                  { value: "Divorce", label: "Divorce" },
                ]}
                defaultValue={marriage?.endCause}
                checkIconPosition="left"
                size="md"
              />

              <Divider />

              <Group>
                <Button type="submit" formAction={submitForm}>
                  Update
                </Button>
                <Button onClick={close}>
                  Close
                </Button>
              </Group>
            </Stack>
          </form>
      </Modal>
    </>
  )
}

export function SuggestSpouses({
  person,
  onPersonClick
} : {
  person: Person,
  onPersonClick: any
}) {
  const [query, setQuery] = useState(person.surname);
  const [persons, setPersons] = useState<Person[]>([]);

  const queryChanged = useDebouncedCallback((query) => {
    setQuery(query);
  }, 300);

  useEffect(() => {
    search();
  }, [query]);

  async function search() {
    setPersons(
      await suggestSpouses(
        query,
        person.id,
        person.sex == "Man" ? "Woman" : "Man",
        dayjs(person.birthDate).subtract(20, "year").month(0).date(1).toDate(),
        dayjs(person.birthDate).add(20, "year").month(11).date(31).toDate()
      )
    );
  }

  return (
    <>
      <TextInput
        id="query"
        onChange={(e) => { queryChanged(e.target.value) }}
        value={query}
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
