import { beforeEach, describe, expect, test as base, vi } from "vitest";
import { render, screen, } from "@/lib/test-utils";

import { Children, Parents, Siblings, Spouses } from "./relatives";
import { Person } from "@/lib/data.d";

import testData from "@/lib/test-data.json"

const test = base.extend({
  testPerson: {
    id: testData.testedPerson.id,
    sex: testData.testedPerson.sex as "Man" | "Woman",
    name: testData.testedPerson.name,
    firstName: testData.testedPerson.firstName,
    surname: testData.testedPerson.surname,
    birthDate: new Date(testData.testedPerson.birthDate)
  },
  spouses: testData.testedPerson.spouses.map((p) => {
    return {
      ...p,
      sex: p.sex as "Man" | "Woman",
      birthDate: new Date(p.birthDate),
      rel: {
        beginDate: new Date(p.rel.beginDate)
      }
    }
  }),
  children: testData.testedPerson.children.map((p) => {
    return {
      ...p,
      sex: p.sex as "Man" | "Woman",
      birthDate: new Date(p.birthDate)
    }
  }),
  parents: testData.testedPerson.parents.map((p) => {
    return {
      ...p,
      sex: p.sex as "Man" | "Woman",
      birthDate: new Date(p.birthDate)
    }
  }),
  siblings: testData.testedPerson.siblings.map((p) => {
    return {
      ...p,
      sex: p.sex as "Man" | "Woman",
      birthDate: new Date(p.birthDate)
    }
  })
});

beforeEach(() => {
  vi.mock("@/lib/data", () => {
    return {
      suggestChildren: () => {
        console.log("Mocked suggestChildren() called");
        return [
        ];
      },
      suggestSpouses: () => {
        console.log("Mocked suggestSpouses() called");
        return [
        ];
      },
    }
  });
});

describe("Lists of relatives", () => {

  describe("Spouses", () => {
    test("should render list of spouses", ({testPerson, spouses}) => {
      // Need to figure it out why vitest creates union for array properties
      const spouses_ = Array.isArray(spouses) ? spouses : [spouses];
      render(<Spouses person={testPerson} spouses={spouses_} />);

      expect(screen.getByRole("table", { name: /spouses/i })).toBeInTheDocument();

      spouses_.forEach((value: Person) => {
        expect(screen.getByRole("row", { name: new RegExp(value.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.firstName) })).toBeInTheDocument();
      })

      expect(screen.getAllByRole("button", { name: /delete relationship/i }).length).equals(spouses_.length);
    });
  });

  describe("Children", () => {
    test("should render children", ({testPerson, children}) => {
      const children_ = Array.isArray(children) ? children : [children];
      render(<Children person={testPerson} data={children_} />);

      expect(screen.getByRole("table", { name: /children/i })).toBeInTheDocument();

      children_.forEach((value: Person) => {
        expect(screen.getByRole("row", { name: new RegExp(value.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.firstName) })).toBeInTheDocument();
      })

      expect(screen.getAllByRole("button", { name: /delete child/i }).length).equals(children_.length);
    });
  });

  describe("Parents", () => {
    test("should render list of parents", ({testPerson, parents}) => {
      // Need to figure it out why vitest creates union for array properties
      const parents_ = Array.isArray(parents) ? parents : [parents];

      render(<Parents person={testPerson} parents={parents_} />);

      expect(screen.getByRole("table", { name: /parents/i })).toBeInTheDocument();

      parents_.forEach((value: Person) => {
        expect(screen.getByRole("row", { name: new RegExp(value.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.firstName) })).toBeInTheDocument();
      })
    });
  });

  describe("Siblings", () => {
    test("should render list of siblings", ({testPerson, siblings}) => {
      // Need to figure it out why vitest creates union for array properties
      const siblings_ = Array.isArray(siblings) ? siblings : [siblings];

      render(<Siblings person={testPerson} siblings={siblings_} />);

      expect(screen.getByRole("table", { name: /siblings/i })).toBeInTheDocument();

      siblings_.forEach((value: Person) => {
        expect(screen.getByRole("row", { name: new RegExp(value.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.firstName) })).toBeInTheDocument();
      })
    });
  });

  describe("All combined", () => {
    test("should render all relatives together ", ({testPerson, spouses, children, parents, siblings}) => {
      render(
        <>
          <Spouses
            person={testPerson}
            spouses={Array.isArray(spouses) ? spouses : [spouses]}
          />
          <Children
            person={testPerson}
            data={Array.isArray(children) ? children : [children]}
          />
          <Parents
            person={testPerson}
            parents={Array.isArray(parents) ? parents : [parents]}
          />
          <Siblings
            person={testPerson}
            siblings={Array.isArray(siblings) ? siblings : [siblings]}
          />
        </>
      );

      expect(screen.getByRole("table", { name: /spouses/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /children/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /parents/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /siblings/i })).toBeInTheDocument();
    });
  });

});
