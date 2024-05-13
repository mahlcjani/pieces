"use client"

import { type Person } from "@/lib/actions/types";
import { createPerson } from "@/lib/actions/people";
import dayjs from "@/lib/dayjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DatePickerInput } from "@mantine/dates";
import { Button, Divider, Group, Select, Stack, TextInput } from "@mantine/core";

export type AddPersonParams = {
  sex?: string;
  omitFields?: string[];
  onCreate?: any;
  onClose?: any;
}

function AddPersonForm({sex, omitFields=[], onCreate, onClose}: AddPersonParams) {
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [name, setName] = useState("");
  const [namePattern, setNamePattern] = useState("${firstName} ${surname}");
  const router = useRouter();

  useEffect(() => {
    setName(namePattern.replace("${firstName}", firstName).replace("${surname}", surname));
  },[firstName, surname]);

  function updateName(value: string) {
    setNamePattern(value.replace(firstName, "${firstName}").replace(surname, "${surname}"));
    setName(value);
  }

  async function submitForm(formData: FormData) {
    try {
      const person: Person|undefined = await createPerson(
        formData.get("sex")?.toString() ?? "Man",
        formData
      );
      if (person !== undefined) {
        alert(`Person (${person.name}) record saved.`);
        if (onCreate) {
          onCreate(person);
        } else {
          router.replace(`/people/${person.id}`);
        }
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <form>
      <Stack>
      { sex && (
        <input type="hidden" name="sex" value={sex} />
      ) || (
        <Select
          name="sex"
          label="Sex"
          required
          data={[
            { value: "Man", label: "Man" },
            { value: "Woman", label: "Woman" },
          ]}
          checkIconPosition="left"
        />
      )}
        <TextInput
          name="firstName"
          label="First name"
          value={firstName}
          required
          onChange={(event) => setFirstName(event.target.value)}
        />
        <TextInput
          name="surname"
          label="Surname"
          value={surname}
          required
          onChange={(event) => setSurname(event.target.value)}
        />
        <TextInput
          name="name"
          label="Name"
          value={name}
          required
          onChange={(event) => updateName(event.target.value)}
        />
      { !omitFields.includes("birthName") && (
        <TextInput
          name="birthName"
          label="Birth name"
        />
      )}
      { !omitFields.includes("nameDate") && (
        <DatePickerInput
          name="nameDate"
          label="Name date"
          valueFormat="MMM D"
          clearable
        />
      )}
        <DatePickerInput
          name="birthDate"
          label="Birth date"
          dropdownType="modal"
          required
        />
      { !omitFields.includes("deathDate") && (
        <DatePickerInput
          name="deathDate"
          label="Death date"
          valueFormat="ll"
          clearable
        />
      )}

        <Divider />

        <Group>
          <Button type="submit" formAction={submitForm}>
            Create
          </Button>
          { onClose && (
          <Button formAction={onClose}>
            Close
          </Button>
          )}
        </Group>
      </Stack>
    </form>
  );
}
