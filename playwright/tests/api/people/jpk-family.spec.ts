import { expect } from "@playwright/test";
import { test as base } from "../steps";

/**
 * Person under test (id) exposed as a fixture.
 */
const test = base.extend<{jpk: string}>({
  jpk: async ({ steps }, use) => {
    await test.step("get identifier", async () => {
      const result = await steps.find("query 'joseph patrick kennedy sr.'", {
        query: "joseph patrick kennedy sr.",
        limit: 2
      });

      expect(result, "search returns only one result").toHaveLength(1);
      expect(result, "search result includes 'Joseph Patrick Kennedy Sr.'").toContainEqual(
        expect.objectContaining({"name": "Joseph Patrick Kennedy Sr."})
      );

      await use(result[0].id);
    });
  }
});

/**
 * Tests depends on Kennedy family being loaded into Neo4j
 */
test.describe(() => {

  test("should fetch Joseph Patrick Kennedy Sr. family", async ({ jpk, steps }) => {
    const result = await steps.readPersonEx("read full record", jpk);

    test.step("check marriages", () => {
      checkMarriages(result.marriages);
    });

    test.step("check children", () => {
      checkChildren(result.children);
    });

    test.step("check parents", () => {
      checkParents(result.parents);
    });

    test.step("check siblings", () => {
      checkSiblings(result.siblings);
    });
  });

  test("should fetch Joseph Patrick Kennedy Sr. relatives", async ({ jpk, steps }) => {
    test.step("check marriages", async () => {
      checkMarriages(await steps.readMarriages("fetch marriages", jpk));
    });

    test.step("check children", async () => {
      checkChildren(await steps.readChildren("fetch children", jpk));
    });

    test.step("check parents", async () => {
      checkParents(await steps.readParents("fetch parents", jpk));
    });

    test.step("check siblings", async () => {
      checkSiblings(await steps.readSiblings("fetch siblings", jpk));
    });
  });

});

// Extended checks striclty related to the person under test, i.e. Joseph Patrick Kennedy Sr.

function checkMarriages(json: any) {
  expect(json).toHaveLength(1);
  expect(json).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "wife": expect.objectContaining({
          "name": "Rose Elizabeth Kennedy",
          "birthName": "Fitzgerald"
        }),
        "husband": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      })
    ])
  );
}

function checkChildren(json: any) {
  expect(json).toHaveLength(9);
  expect(json).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "child": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Jr."
        }),
        "parent": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      }),
      expect.objectContaining({
        "child": expect.objectContaining({
          "name": "John Fitzgerald Kennedy"
        }),
        "parent": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      }),
      expect.objectContaining({
        "child": expect.objectContaining({
          "name": "Robert Francis Kennedy"
        }),
        "parent": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      })
    ])
  );
}

function checkParents(json: any) {
  expect(json).toHaveLength(2);
  expect(json).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "parent": expect.objectContaining({
          "name": "Patrick Joseph Kennedy"
        }),
        "child": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      }),
      expect.objectContaining({
        "parent": expect.objectContaining({
          "name": "Mary Augusta Kennedy"
        }),
        "child": expect.objectContaining({
          "name": "Joseph Patrick Kennedy Sr."
        })
      })
    ])
  );
}

function checkSiblings(json: any) {
  expect(json).toHaveLength(3);
  expect(json).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        "name": "Francis Benedict Kennedy"
      }),
      expect.objectContaining({
        "name": "Mary Loretta Connelly"
      }),
      expect.objectContaining({
        "name": "Margaret Louise Burke"
      })
    ])
  );
}
