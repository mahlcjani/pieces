"use client"

import { AddPersonForm } from "../addPerson";
import { type Person } from "@/lib/data.d";
import {
  createSpouseRel,
  createPerson,
  deleteRel,
  suggestSpouses,
  updateSpouseRel,
} from "@/lib/data";
import { formatDate4Form } from "@/lib/utils";

import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Link,
  Modal,
  ModalDialog,
  Option,
  Select,
  Stack,
  Table
} from "@mui/joy";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LinkOffOutlinedIcon from "@mui/icons-material/LinkOffOutlined";

import { useDebouncedCallback } from "use-debounce";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function AddSpouse({person}: {person: Person}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function addSpouse(formData: FormData) {
    try {
      const spouse: Person|undefined = await createPerson(
        person.sex == "Man" ? "Woman" : "Man",
        formData
      );
      if (spouse) {
        alert(`Person (${spouse.name}) record saved.`);

        await createSpouseRel(person.id, spouse.id, new FormData());
        alert(`${person.firstName} and ${spouse.firstName} are family.`);

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
      <Button variant="outlined" color="neutral" onClick={() => setOpen(true)}>
        Add Spouse
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <AddPersonForm omitFields={["sex"]} onCreate={addSpouse} />
        </ModalDialog>
      </Modal>
    </>
  );
}

export function LinkSpouse({person}: {person: Person}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function linkSpouse(spouse: Person) {
    try {
      await createSpouseRel(person.id, spouse.id, new FormData());
      alert(`${person.firstName} and ${spouse.firstName} are family.`);

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
        Link Spouse
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog sx={{minHeight: 400}}>
          <SuggestSpouses person={person} onPersonClick={linkSpouse} />
        </ModalDialog>
      </Modal>
    </>
  );
}

export function UnlinkSpouse({person, spouse}: {person: Person, spouse: Person}) {
  const router = useRouter();

  async function unlinkSpouse() {
    if (confirm(`Delete relation with ${spouse.firstName}?`)) {
      try {
        await deleteRel(spouse.rel.id);
        router.refresh();
      } catch (e: any) {
        console.log(e);
        alert(e.message);
      }
    }
  }

  return (
    <IconButton aria-label="Delete relationship" onClick={() => unlinkSpouse()}>
      <LinkOffOutlinedIcon />
    </IconButton>
  )
}

export function EditSpouse({person, spouse}: {person: Person, spouse: Person}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  async function updateSpouse(formData: FormData) {
    try {
      await updateSpouseRel(spouse.rel.id, formData);

      router.refresh();
      setOpen(false);
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <>
      <IconButton aria-label="Edit relationship" onClick={() => setOpen(true)}>
        <EditOutlinedIcon />
      </IconButton>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <form>
            <Stack spacing={1}>
              <FormControl>
                <FormLabel>Begin date</FormLabel>
                <Input
                  type="date"
                  name="beginDate"
                  required
                  defaultValue={formatDate4Form(spouse.rel?.beginDate)}
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel>End date</FormLabel>
                <Input
                  type="date"
                  name="endDate"
                  defaultValue={formatDate4Form(spouse.rel?.endDate)}
                  variant="outlined"
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="endCause">End cause</FormLabel>
                <Select name="endCause" defaultValue={spouse.rel?.endCause}>
                  <Option value="HisDeath">His death</Option>
                  <Option value="HerDeath">Her death</Option>
                  <Option value="Divorce">Divorce</Option>
                </Select>
              </FormControl>

              <Divider />

              <ButtonGroup>
                <Button type="submit" formAction={updateSpouse}>
                  Update
                </Button>
              </ButtonGroup>
            </Stack>
          </form>
        </ModalDialog>
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
        new Date(person.birthDate.getFullYear()-20, 0, 1),
        new Date(person.birthDate.getFullYear()+20, 11, 31)
      )
    );
  }

  return (
    <>
      <FormControl>
        <Input
          id="query"
          onChange={(e) => { queryChanged(e.target.value) }}
          value={query}
        />
      </FormControl>

      <Table>
        <tbody>
        {persons?.map((p) => (
          <tr key={p.id}>
            <td>
              <Link onClick={() => onPersonClick({...p})}>
                {p.name}
              </Link>
            </td>
            <td>{formatDate4Form(p.birthDate)}</td>
          </tr>
        ))}
        </tbody>
      </Table>
    </>
  );
}
