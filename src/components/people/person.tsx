"use client"

import { type Person } from "@/lib/actions/types";
import { updatePerson } from "@/lib/actions/people";
import { formatString4Form } from "@/lib/utils";

import { DatePickerInput } from '@mantine/dates';
import { Input } from "@mantine/core";

import styles from "../people.module.css";

import {
  Button,
  ButtonGroup,
  Divider,
  Stack,
} from "@mui/joy";

import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ShowEditPerson({
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
    <form>
      <Stack spacing={1}>
        <label className={styles.formControl}>
          <div className={styles.label}>First name</div>
          <Input
            name="firstName"
            value={firstName}
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
            onChange={(event) => setFirstName(event.target.value)}
            className={styles.control}
            size="md"
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Surname</div>
          <Input
            name="surname"
            value={surname}
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
            onChange={(event) => setSurname(event.target.value)}
            className={styles.control}
            size="md"
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Name</div>
          <Input
            name="name"
            value={name}
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
            onChange={(event) => updateName(event.target.value)}
            className={styles.control}
            size="md"
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth name</div>
          <Input
            name="birthName"
            defaultValue={props.birthName}
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
            className={styles.control}
            size="md"
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
            variant={readOnly ? "filled" : "default"}
            className={styles.control}
            size="md"
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth date</div>
          <DatePickerInput
            name="birthDate"
            defaultValue={props.birthDate ? dayjs(props.birthDate).toDate() : null}
            readOnly={readOnly}
            variant={readOnly ? "filled" : "default"}
            className={styles.control}
            size="md"
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Death date</div>
          <DatePickerInput
            name="deathDate"
            defaultValue={props.deathDate ? dayjs(props.deathDate).toDate() : null}
            readOnly={readOnly}
            clearable
            variant={readOnly ? "filled" : "default"}
            className={styles.control}
            size="md"
          />
        </label>
        <Divider />
        <ButtonGroup>
          <Button disabled={!readOnly} onClick={() => { setReadOnly(false); }}>
            Edit
          </Button>
          <Button disabled={readOnly} type="submit" formAction={submitForm}>
            Update
          </Button>
          <Button disabled={readOnly} onClick={() => { setReadOnly(true) }}>
            Cancel
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}
