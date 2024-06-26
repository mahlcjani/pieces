import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, userEvent, fireEvent } from "@/lib/test-utils";

import { AddSpouse, LinkSpouse } from "./spouses";
import { Person } from "@/lib/actions/types";

import testData from "@/lib/test-data.json" assert { type: "json" };

beforeEach(() => {
  vi.mock("@/lib/actions/people", () => {
    return {
      suggestSpouses: () => {
        return [
        ];
      },
    }
  });
});

describe("Spouses buttons", () => {

  const person = testData.testedPerson as Person;

  describe("AddSpouse", () => {
    test.skip("should render 'Add Spouse' button and open modal dialog", async () => {
      render(<AddSpouse person={person}/>);

      // assert modal is not open
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(screen.queryByRole("button", { name: /create/i })).not.toBeInTheDocument();

      // open modal
      const button = screen.getByRole("button", { name: /add spouse/i });
      expect(button).toBeInTheDocument();
      await userEvent.click(button);

      // check modal is open (submit button is rendered)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /create/i })).toBeInTheDocument();

      {
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

      // ... more fields?
    });
  });

  describe("LinkSpouse", () => {
    test.skip("should render 'Link Spouse' button and open modal dialog", async () => {
      render(<LinkSpouse person={person}/>);

      // assert modal is not open
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();

      // open modal
      const button = screen.getByRole("button", { name: /link spouse/i });
      expect(button).toBeInTheDocument();
      await userEvent.click(button);

      // check modal is open (submit button is rendered)
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
  });
});
