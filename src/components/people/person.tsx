"use client"

import { type Person } from "@/lib/actions/types";
import { createPerson, updatePerson } from "@/lib/actions/people";
import { formatString4Form } from "@/lib/utils";

import {
  Button,
  Divider,
  Group,
  Select,
  Stack,
  TextInput
} from "@mantine/core";

import { DatePickerInput } from '@mantine/dates';

import dayjs from "@/lib/dayjs";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import styles from "../people.module.css";

export function ShowEditPerson({
  id,
  props
}: {
  id: string,
  props: {
    name: string,
    firstName: string,
    nameDate?: string,
    surname: string,
    birthName?: string,
    birthDate: string,
    deathDate?: string
  }
}) {
  const [firstName, setFirstName] = useState(formatString4Form(props.firstName));
  const [surname, setSurname] = useState(formatString4Form(props.surname));
  const [name, setName] = useState(formatString4Form(props.name));
  const [namePattern, setNamePattern] = useState(name.replace(firstName, "${firstName}").replace(surname, "${surname}"));

  useEffect(() => {
    setName(namePattern.replace("${firstName}", firstName).replace("${surname}", surname));
  },[firstName, surname]);

  function updateName(value: string) {
    setNamePattern(value.replace(firstName, "${firstName}").replace(surname, "${surname}"));
    setName(value);
  }

/*
  function createNamePattern(): string {
    return name.replaceAll(firstName, "${firstName}").replaceAll(surname, "${surname}");
  }

  const [namePattern, setNamePattern] = useState(createNamePattern());

  useEffect(() => {
    let newName = namePattern.replaceAll("${firstName}", firstName).replaceAll("${surname}", surname)
    setName(newName);
  },[firstName, surname]);

  useEffect(() => {
    setNamePattern(createNamePattern());
  },[name]);
*/

  // Consider dropdowns and inputs per example https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
  const months = [...Array(12)].map((_, index) => {
    return { label: dayjs().month(index).format("MMMM"), value: index }
  });

  // TODO: make dynamic dependent on month
  const days = [...Array(31)].map((_, index) => {
    return { label: index+1, value: index+1 }
  });

  const [readOnly, setReadOnly] = useState(true);
  const router = useRouter();

  async function submitForm(formData: FormData) {
    //"use server"
    try {
      const person: Person|undefined = await updatePerson(id, formData);
      if (person) {
        alert(`Person (${person.name}) record saved.`);
        setReadOnly(true);
        router.refresh();
      }
    } catch (e: any) {
      console.log(e);
      alert(e.message);
    }
  }

  return (
    <form data-testid="person-form">
      <Stack>
        <label className={styles.formControl}>
          <div className={styles.label}>First name</div>
          <TextInput
            name="firstName"
            value={firstName}
            readOnly={readOnly}
            variant={readOnly ? "unstyled" : "default"}
            onChange={(event) => setFirstName(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Surname</div>
          <TextInput
            name="surname"
            value={surname}
            readOnly={readOnly}
            variant={readOnly ? "unstyled" : "default"}
            onChange={(event) => setSurname(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Name</div>
          <TextInput
            name="name"
            value={name}
            readOnly={readOnly}
            variant={readOnly ? "unstyled" : "default"}
            onChange={(event) => updateName(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth name</div>
          <TextInput
            name="birthName"
            defaultValue={props.birthName}
            readOnly={readOnly}
            variant={readOnly ? "unstyled" : "default"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Name date</div>
          <DatePickerInput
            name="nameDate"
            defaultValue={props.nameDate ? dayjs(props.nameDate).toDate() : null}
            valueFormat="MMM D"
            readOnly={readOnly}
            clearable
            variant={readOnly ? "unstyled" : "default"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth date</div>
          <DatePickerInput
            name="birthDate"
            defaultValue={props.birthDate ? dayjs(props.birthDate).toDate() : null}
            valueFormat="ll"
            readOnly={readOnly}
            variant={readOnly ? "unstyled" : "default"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Death date</div>
          <DatePickerInput
            name="deathDate"
            defaultValue={props.deathDate ? dayjs(props.deathDate).toDate() : null}
            valueFormat="ll"
            readOnly={readOnly}
            clearable
            variant={readOnly ? "unstyled" : "default"}
            className={styles.control}
          />
        </label>

        <Divider />

        <Group grow={true}>
          <Button disabled={!readOnly} onClick={() => { setReadOnly(false); }}>
            Edit
          </Button>
          <Button disabled={readOnly} type="submit" formAction={submitForm}>
            Update
          </Button>
          <Button disabled={readOnly} type="reset" onClick={() => { setReadOnly(true) }}>
            Cancel
          </Button>
        </Group>
      </Stack>
    </form>
  );
}

export type AddPersonParams = {
  sex?: string;
  omitFields?: string[];
  onCreate?: any;
  onClose?: any;
}

export function AddPersonForm({sex, omitFields=[], onCreate, onClose}: AddPersonParams) {
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
    <form data-testid="add-person-form">
      <Stack>
      { sex && (
        <input type="hidden" name="sex" value={sex} />
      )}
      { !sex && (
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
