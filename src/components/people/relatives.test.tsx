import { beforeEach, describe, expect, test as base, vi } from "vitest";
import { render, screen, } from "@/lib/test-utils";

import { Children, Parents, Siblings, Marriages } from "./relatives";
import { Parentage, type Marriage, type Person } from "@/lib/actions/types";

import testData from "@/lib/test-data.json" assert { type: "json" };

const test = base.extend({
  testPerson: testData.testedPerson as Person,
  marriages: testData.testedPerson.marriages.map((rel) => {
    return {
      id: rel.id,
      beginDate: rel.beginDate,
      wife: rel.wife,
      husband: testData.testedPerson,
    } as Marriage
  }),
  children: testData.testedPerson.children.map((p) => {
    return {
      id: `rel-${p.id}`,
      child: p,
      parent: testData.testedPerson,
    } as Parentage
  }),
  parents: testData.testedPerson.parents.map((p) => {
    return {
      id: `rel-${p.id}`,
      parent: p,
      child: testData.testedPerson,
    } as Parentage
  }),
  siblings: testData.testedPerson.siblings.map((p) => {
    return p as Person
  })
});

beforeEach(() => {
  vi.mock("@/lib/actions/people", () => {
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

  describe("Marriages", () => {
    test("should render list of marriages", ({testPerson, marriages}) => {
      // Need to figure it out why vitest creates union for array properties
      const marriages_ = Array.isArray(marriages) ? marriages : [marriages];
      render(<Marriages person={testPerson} records={marriages_} />);

      expect(screen.getByRole("table", { name: /marriages/i })).toBeInTheDocument();

      marriages_.forEach((value: Marriage) => {
        expect(screen.getByRole("row", { name: new RegExp(value.wife.firstName) })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: new RegExp(value.wife.firstName) })).toBeInTheDocument();
      })

      expect(screen.getAllByRole("button", { name: /delete/i }).length).equals(marriages_.length);
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

      expect(screen.getAllByRole("button", { name: /delete/i }).length).equals(children_.length);
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

      expect(screen.getByRole("table", { name: /marriages/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /children/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /parents/i })).toBeInTheDocument();
      expect(screen.getByRole("table", { name: /siblings/i })).toBeInTheDocument();
    });
  });

});
