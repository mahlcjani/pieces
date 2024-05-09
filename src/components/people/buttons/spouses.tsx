"use client"

import { AddPersonForm } from "../addPerson";
import { Marriage, type Person } from "@/lib/actions/types";
import {
  createMarriage,
  createPerson,
  deleteRel,
  suggestSpouses,
  updateMarriage,
} from "@/lib/actions/people";

import dayjs from "@/lib/dayjs";

import {
  ActionIcon,
  Button,
  Divider,
  Group,
  Input,
  Modal,
  Select,
  Stack,
  Text
} from "@mantine/core";


import { DatePickerInput } from "@mantine/dates";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { modals } from '@mantine/modals';


import {
  IconButton,
  Link,
  Table
} from "@mui/joy";

import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AddSpouse({person}: {person: Person}) {
  const [opened, { open, close }] = useDisclosure(false);
  const isSmallDevice = useMediaQuery("(max-width: 50em)");
  const router = useRouter();

  async function addSpouse(formData: FormData) {
    try {
      const spouse: Person|undefined = await createPerson(
        person.sex == "Man" ? "Woman" : "Man",
        formData
      );
      if (spouse) {
        alert(`Person (${spouse.name}) record saved.`);

        await createMarriage(person.id, spouse.id, new FormData());
        alert(`${person.firstName} and ${spouse.firstName} are family.`);

        router.refresh();
        close();
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <Button variant="outlined" color="neutral" onClick={open}>
        Add Spouse
      </Button>
      <Modal
        title="New person"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <AddPersonForm omitFields={["sex"]} onCreate={addSpouse} />
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
      <Button variant="outlined" color="neutral" onClick={open}>
        Link Spouse
      </Button>
      <Modal
        title="Find spouse"
        opened={opened}
        onClose={close}
        withCloseButton={isSmallDevice}
        fullScreen={isSmallDevice}
        transitionProps={{ transition: "slide-left", duration: 400 }}
      >
        <SuggestSpouses person={person} onPersonClick={linkSpouse} />
        <Divider />
        <Group>
          <Button onClick={close}>
            Close
          </Button>
        </Group>
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
      <Input
        id="query"
        onChange={(e) => { queryChanged(e.target.value) }}
        value={query}
      />

      <Table>
        <tbody>
        {persons?.map((p) => (
          <tr key={p.id}>
            <td>
              <Link onClick={() => onPersonClick({...p})}>
                {p.name}
              </Link>
            </td>
            <td>{dayjs(p.birthDate).format("ll")}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}
