"use client"

import { type Person } from "@/lib/data.d";
import { updatePerson } from "@/lib/data";
import { formatDate4Form, formatString4Form } from "@/lib/utils";

import styles from "../people.module.css";

import {
  Button,
  ButtonGroup,
  Divider,
  Input,
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
    nameDate?: Date,
    surname: string,
    birthName?: string,
    birthDate: Date,
    deathDate?: Date
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
            variant={readOnly ? "plain" : "outlined"}
            onChange={(event) => setFirstName(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Surname</div>
          <Input
            name="surname"
            value={surname}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            onChange={(event) => setSurname(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Name</div>
          <Input
            name="name"
            value={name}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            onChange={(event) => updateName(event.target.value)}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth name</div>
          <Input
            name="birthName"
            defaultValue={props.birthName}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Name date</div>
          <Input
            type="date"
            name="nameDate"
            defaultValue={formatDate4Form(props.nameDate)}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Birth date</div>
          <Input
            type="date"
            name="birthDate"
            defaultValue={formatDate4Form(props.birthDate)}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            className={styles.control}
          />
        </label>
        <label className={styles.formControl}>
          <div className={styles.label}>Death date</div>
          <Input
            type="date"
            name="deathDate"
            defaultValue={formatDate4Form(props.deathDate)}
            readOnly={readOnly}
            variant={readOnly ? "plain" : "outlined"}
            className={styles.control}
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
