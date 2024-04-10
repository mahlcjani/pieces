import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, userEvent } from "@/lib/test-utils";

//import {render, screen} from "@testing-library/react";
//import userEvent from "@testing-library/user-event";

import { AddChild, LinkChild } from "./children";
import testData from "@/lib/test-data.json"

beforeEach(() => {
  vi.mock("@/lib/data", () => {
    return {
      suggestChildren: () => {
        return [
        ];
      }
    }
  });
});

describe("Children buttons", () => {

  const parent = {
    ...testData.testedPerson,
    sex: testData.testedPerson.sex as "Man" | "Woman",
    birthDate: new Date(testData.testedPerson.birthDate)
  };

  describe("AddChild", () => {
    test("should render 'Add Child' button and open modal dialog", async () => {
      render(<AddChild parent={parent}/>);
      // use screen.logTestingPlaygroundURL() while unsure how to select elements

      // assert modal is not open
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /create/i })).not.toBeInTheDocument();

      // open modal
      const button = screen.getByRole("button", { name: /add child/i });
      expect(button).toBeInTheDocument();
      await userEvent.click(button);

      // check modal is open (submit button is rendered)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();

      {
        //getByRole("textbox", { name: /last name/i })
        const input = screen.getByLabelText(/^first name/i);
        expect(input).toBeInTheDocument();
        await userEvent.type(input, "John");
        expect(input).toHaveValue("John");
      }

      {
        const input = screen.getByLabelText(/^surname/i);
        expect(input).toBeInTheDocument();
        await userEvent.type(input, "Smith");
        expect(input).toHaveValue("Smith");
      }

      {
        const input = screen.getByLabelText(/^name/i);
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue("John Smith");
      }

      {
        const input = screen.getByLabelText(/birth date/i);
        expect(input).toBeInTheDocument();
        await userEvent.type(input, "12/31/1999");
        // this is actually input of type date, cannot test it that way
        //expect(input).toHaveDisplayValue("12/31/1999");
      }
    });
  });

  describe("LinkChild", () => {
    test("should render 'Link Child' button and open modal dialog", async () => {
      render(<LinkChild parent={parent}/>);

      // assert modal is not open
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // open modal
      const button = screen.getByRole("button", { name: /link child/i });
      expect(button).toBeInTheDocument();
      await userEvent.click(button);

      // check modal is open (submit button is rendered)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
