import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, userEvent } from "@/lib/test-utils";

import Page from "./page";
import { Person } from "@/lib/data.d";

const person: Person = {
  id: "1",
  sex: "Man",
  firstName: "Joe",
  surname: "Doe",
  name: "Joe Doe",
  birthDate: new Date("1981-01-01")
};

beforeEach(() => {
  vi.mock("@/lib/data", () => {
    return {
      fetchPerson: () => {
        return person;
      },
      fetchSpouses: () => {
        return [
        ];
      },
      fetchChildren: () => {
        return [
        ];
      },
      fetchParents: () => {
        return [
        ];
      },
      fetchSiblings: () => {
        return [
        ];
      },
      suggestChildren: () => {
        return [
        ];
      },
      suggestSpouses: () => {
        return [
        ];
      },
    }
  });
});

describe("Person page", () => {

  test.skip("should render all tabs", async () => {
    render(<Page params={{ id: "1dd"}} />);

    screen.logTestingPlaygroundURL();
  });

});
