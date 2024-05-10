import { assert, describe, expect, test as base } from "vitest";
import { screen, setup } from "@/lib/test-utils";
import dayjs from "@/lib/dayjs";

import { type Person } from "@/lib/actions/types";
import testData from "@/lib/test-data.json"

// Components under tests
import { AddPersonForm, ShowEditPerson } from "./person";

const test = base.extend({
  testPerson: testData.testedPerson as Person
});

describe("person.tsx", () => {

  describe("<ShowEditPerson /> component", () => {
    test("view person record", async ({testPerson}) => {
      const { user, container } = setup(
        <ShowEditPerson
          id={testPerson.id}
          props={{
            name: testPerson.name,
            firstName: testPerson.firstName,
            surname: testPerson.surname,
            birthDate: testPerson.birthDate,
            birthName: testPerson.birthName,
            deathDate: testPerson.deathDate,
            nameDate: testPerson.nameDate
          }}
        />
      );

      expect(screen.getByRole("textbox", { name: /^name$/i })).toHaveValue(testPerson.name);
      expect(screen.getByRole("textbox", { name: /first name/i })).toHaveValue(testPerson.firstName);
      expect(screen.getByRole("textbox", { name: /surname/i })).toHaveValue(testPerson.surname);

      // Unfortunatelly date pickers are not easy to select, actual inputs are hidden
      expect(container.querySelector("form[data-testid='person-form']")).toHaveFormValues({
        name: testPerson.name,
        firstName: testPerson.firstName,
        surname: testPerson.surname,
        birthDate: dayjs(testPerson.birthDate).toISOString()
      });

      try {
        await user.clear(screen.getByRole("textbox", { name: /first name/i }));
        assert.fail("first name input is editable!");
      } catch (e: any) {
        expect(true, "first name input is not editable").toBeTruthy();
      }
    });

    test("edit person record", async ({testPerson}) => {
      const { user } = setup(
        <ShowEditPerson
          id={testPerson.id}
          props={{
            name: testPerson.name,
            firstName: testPerson.firstName,
            surname: testPerson.surname,
            birthDate: testPerson.birthDate,
            birthName: testPerson.birthName,
            deathDate: testPerson.deathDate,
            nameDate: testPerson.nameDate
          }}
        />
      );

      await user.click(screen.getByRole("button", { name: /edit/i }));

      const input = screen.getByRole("textbox", { name: /first name/i } )

      await user.clear(input);
      expect(input).toHaveValue("");

      await user.type(input, "John")
      expect(input).toHaveValue("John");
    });
  });

  describe("<AddPersonForm /> component", () => {
    test("with default options />", () => {
      const { user, container } = setup(
        <AddPersonForm />
      );

      expect(container.querySelector("form[data-testid='add-person-form']")).toHaveFormValues({
        sex: "",
        name: " ", // name is auto generated
        firstName: "",
        surname: "",
        birthName: "",
        birthDate: "",
        deathDate: "",
        nameDate: ""
      });

      expect(container.querySelector("[name='sex']")).toBeInTheDocument();
      expect(container.querySelector("[name='name']")).toBeInTheDocument();
      expect(container.querySelector("[name='firstName']")).toBeInTheDocument();
      expect(container.querySelector("[name='surname']")).toBeInTheDocument();
      expect(container.querySelector("[name='birthName']")).toBeInTheDocument();
      expect(container.querySelector("[name='birthDate']")).toBeInTheDocument();
      expect(container.querySelector("[name='nameDate']")).toBeInTheDocument();
      expect(container.querySelector("[name='deathDate']")).toBeInTheDocument();
    });

    test("with sex='Woman' />", () => {
      const { user, container } = setup(
        <AddPersonForm sex='Woman' />
      );

      expect(container.querySelector("form[data-testid='add-person-form']")).toHaveFormValues({
        sex: "Woman",
      });
    });

    test("with omitFields=['birthName', 'nameDate', 'deathDate'] />", () => {
      const { user, container } = setup(
        <AddPersonForm omitFields={['birthName', 'nameDate', 'deathDate']} />
      );

      expect(container.querySelector("[name='birthName']")).not.toBeInTheDocument();
      expect(container.querySelector("[name='nameDate']")).not.toBeInTheDocument();
      expect(container.querySelector("[name='deathDate']")).not.toBeInTheDocument();
    });
  });
});
