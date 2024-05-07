"use client"

import { type Person } from "@/lib/actions/types";
import { createPerson } from "@/lib/actions/people";

import {
  Button,
  ButtonGroup,
  Divider,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Option,
  Select,
  Stack
} from "@mui/joy";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// To be replaced by the second one
export default function AddPerson() {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [namePattern, setNamePattern] = useState("${firstName} ${surname}");

  useEffect(() => {
    setName(namePattern.replace("${firstName}", firstName).replace("${surname}", surname));
  },[firstName, surname]);

  function updateName(value: string) {
    setNamePattern(value.replace(firstName, "${firstName}").replace(surname, "${surname}"));
    setName(value);
  }

  const router = useRouter();

  async function submitForm(formData: FormData) {
    //"use server"
    try {
      const person: Person|undefined = await createPerson(
        formData.get("sex")?.toString() ?? "Man",
        formData
      );
      if (person) {
        alert(`Person (${person.name}) record saved.`);
        // redirect to person page
        router.replace(`/people/${person.id}`);
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <form>
      <Stack spacing={1}>
        <FormControl>
          <FormLabel htmlFor="sex">Sex</FormLabel>
          <Select name="sex">
            <Option value="Man">Man</Option>
            <Option value="Woman">Woman</Option>
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel htmlFor="name">First name</FormLabel>
          <Input
            name="firstName"
            value={firstName}
            variant="outlined"
            onChange={(event) => setFirstName(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Surname</FormLabel>
          <Input
            name="surname"
            value={surname}
            variant="outlined"
            onChange={(event) => setSurname(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            value={name}
            variant="outlined"
            onChange={(event) => updateName(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Birth name</FormLabel>
          <Input
            name="birthName"
            defaultValue=""
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Name date</FormLabel>
          <Input
            type="date"
            name="nameDate"
            defaultValue=""
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Birth date</FormLabel>
          <Input
            type="date"
            name="birthDate"
            defaultValue=""
            variant="outlined"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Death date</FormLabel>
          <Input
            type="date"
            name="deathDate"
            defaultValue=""
            variant="outlined"
          />
        </FormControl>

        <Divider />

        <ButtonGroup>
          <Button type="submit" formAction={submitForm}>
            Create
          </Button>
          <Button>
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}

export function AddPersonForm({
  omitFields = [],
  onCreate,
  onClose
} : {
  omitFields?: string[],
  onCreate: any,
  onClose?: any
}) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [namePattern, setNamePattern] = useState("${firstName} ${surname}");

  useEffect(() => {
    setName(namePattern.replace("${firstName}", firstName).replace("${surname}", surname));
  },[firstName, surname]);

  function updateName(value: string) {
    setNamePattern(value.replace(firstName, "${firstName}").replace(surname, "${surname}"));
    setName(value);
  }

  return (
    <form>
      <Stack spacing={1}>
        { !omitFields.includes("sex") && (
          <FormControl>
            <FormLabel>Sex</FormLabel>
            <Select name="sex" required>
              <Option value="Man">Man</Option>
              <Option value="Woman">Woman</Option>
            </Select>
          </FormControl>
        )}
        <FormControl>
          <FormLabel>First name</FormLabel>
          <Input
            name="firstName"
            required
            value={firstName}
            variant="outlined"
            onChange={(event) => setFirstName(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Surname</FormLabel>
          <Input
            name="surname"
            required
            value={surname}
            variant="outlined"
            onChange={(event) => setSurname(event.target.value)}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Name</FormLabel>
          <Input
            name="name"
            required
            value={name}
            variant="outlined"
            onChange={(event) => updateName(event.target.value)}
          />
        </FormControl>
        { !omitFields.includes("birthDate") && (
          <FormControl>
            <FormLabel>Birth date</FormLabel>
            <Input
              type="date"
              name="birthDate"
              required
              defaultValue=""
              variant="outlined"
            />
          </FormControl>
        )}
        { !omitFields.includes("deathDate") && (
          <FormControl>
            <FormLabel>Death date</FormLabel>
            <Input
              type="date"
              name="deathDate"
              defaultValue=""
              variant="outlined"
            />
          </FormControl>
        )}

        <Divider />

        <ButtonGroup>
          <Button type="submit" formAction={onCreate}>
            Create
          </Button>
          { onClose && (
          <Button formAction={onClose}>
            Close
          </Button>
          )}
        </ButtonGroup>
      </Stack>
    </form>
  );
}

/*

Usage:

const [open, setOpen] = useState(false)

<button onClick={() => setOpen(true)}>Add Person</button>

<AddPersonModal open={open} onClose={() => setOpen(false)} />

*/

export function AddPersonModal({
  open,
  omitFields = [],
  onCreate,
  onClose
} : {
  open: any,
  omitFields?: string[],
  onCreate: any,
  onClose?: any
}) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [namePattern, setNamePattern] = useState("${firstName} ${surname}");

  useEffect(() => {
    setName(namePattern.replace("${firstName}", firstName).replace("${surname}", surname));
  },[firstName, surname]);

  function updateName(value: string) {
    setNamePattern(value.replace(firstName, "${firstName}").replace(surname, "${surname}"));
    setName(value);
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
    >
    <form>
        <Stack spacing={1}>
          { !omitFields.includes("sex") && (
            <FormControl>
              <FormLabel htmlFor="sex">Sex</FormLabel>
              <Select name="sex" required>
                <Option value="Man">Man</Option>
                <Option value="Woman">Woman</Option>
              </Select>
            </FormControl>
          )}
          <FormControl>
            <FormLabel htmlFor="name">First name</FormLabel>
            <Input
              name="firstName"
              required
              value={firstName}
              variant="outlined"
              onChange={(event) => setFirstName(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Surname</FormLabel>
            <Input
              name="surname"
              required
              value={surname}
              variant="outlined"
              onChange={(event) => setSurname(event.target.value)}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Name</FormLabel>
            <Input
              name="name"
              required
              value={name}
              variant="outlined"
              onChange={(event) => updateName(event.target.value)}
            />
          </FormControl>
          { !omitFields.includes("birthDate") && (
            <FormControl>
              <FormLabel>Birth date</FormLabel>
              <Input
                type="date"
                name="birthDate"
                required
                defaultValue=""
                variant="outlined"
              />
            </FormControl>
          )}
          { !omitFields.includes("deathDate") && (
            <FormControl>
              <FormLabel>Death date</FormLabel>
              <Input
                type="date"
                name="deathDate"
                defaultValue=""
                variant="outlined"
              />
            </FormControl>
          )}

          <Divider />

          <ButtonGroup>
            <Button type="submit" formAction={onCreate}>
              Create
            </Button>
            { onClose && (
            <Button formAction={onClose}>
              Close
            </Button>
            )}
          </ButtonGroup>
        </Stack>
      </form>
    </Modal>
  );
}

