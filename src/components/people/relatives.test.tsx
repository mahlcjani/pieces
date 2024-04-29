import { beforeEach, describe, expect, test as base, vi } from "vitest";
import { render, screen, } from "@/lib/test-utils";

import { Children, Parents, Siblings, Marriages } from "./relatives";
import { Parentage, type Marriage, type Person } from "@/lib/data.d";

import testData from "@/lib/test-data.json"

const test = base.extend({
  testPerson: {
    ...testData.testedPerson,
    sex: testData.testedPerson.sex as "Man" | "Woman",
    birthDate: new Date(testData.testedPerson.birthDate)
  },
  marriages: testData.testedPerson.marriages.map((rel) => {
    return {
      id: rel.id,
      beginDate: new Date(rel.beginDate),
      spouses: {
        ...rel.spouses,
        sex: rel.spouses.sex as "Man" | "Woman",
        birthDate: new Date(rel.spouses.birthDate)
      }
    }
  }),
  children: testData.testedPerson.children.map((p) => {
    return {
      id: `rel-${p.id}`,
      child: {
        ...p,
        sex: p.sex as "Man" | "Woman",
        birthDate: new Date(p.birthDate)
      },
      parent: {
        ...testData.testedPerson,
        sex: testData.testedPerson.sex as "Man" | "Woman",
        birthDate: new Date(testData.testedPerson.birthDate)
      }
    }
  }),
  parents: testData.testedPerson.parents.map((p) => {
    return {
      id: `rel-${p.id}`,
      parent: {
        ...p,
        sex: p.sex as "Man" | "Woman",
        birthDate: new Date(p.birthDate)
      },
      child: {
        ...testData.testedPerson,
        sex: testData.testedPerson.sex as "Man" | "Woman",
        birthDate: new Date(testData.testedPerson.birthDate)
      }
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
    test("should render list of spouses", ({testPerson, marriages}) => {
      // Need to figure it out why vitest creates union for array properties
      const marriages_ = Array.isArray(marriages) ? marriages : [marriages];
      render(<Marriages person={testPerson} records={marriages_} />);

      expect(screen.getByRole("table", { name: /spouses/i })).toBeInTheDocument();

      marriages_.forEach((value: Marriage) => {
        expect(screen.getByRole("row", { name: new RegExp(value.spouses.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.spouses.firstName) })).toBeInTheDocument();
      })

      expect(screen.getAllByRole("button", { name: /delete relationship/i }).length).equals(marriages_.length);
    });
  });

  describe("Children", () => {
    test("should render children", ({testPerson, children}) => {
      const children_ = Array.isArray(children) ? children : [children];
      render(<Children person={testPerson} records={children_} />);

      expect(screen.getByRole("table", { name: /children/i })).toBeInTheDocument();

      children_.forEach((value: Parentage) => {
        expect(screen.getByRole("row", { name: new RegExp(value.child.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.child.firstName) })).toBeInTheDocument();
      })

      expect(screen.getAllByRole("button", { name: /delete child/i }).length).equals(children_.length);
    });
  });

  describe("Parents", () => {
    test("should render list of parents", ({testPerson, parents}) => {
      // Need to figure it out why vitest creates union for array properties
      const parents_ = Array.isArray(parents) ? parents : [parents];

      render(<Parents person={testPerson} records={parents_} />);

      expect(screen.getByRole("table", { name: /parents/i })).toBeInTheDocument();

      parents_.forEach((value: Parentage) => {
        expect(screen.getByRole("row", { name: new RegExp(value.parent.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.parent.firstName) })).toBeInTheDocument();
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
    test("should render all relatives together ", ({testPerson, marriages, children, parents, siblings}) => {
      render(
        <>
          <Marriages
            person={testPerson}
            records={Array.isArray(marriages) ? marriages : [marriages]}
          />
          <Children
            person={testPerson}
            records={Array.isArray(children) ? children : [children]}
          />
          <Parents
            person={testPerson}
            records={Array.isArray(parents) ? parents : [parents]}
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
