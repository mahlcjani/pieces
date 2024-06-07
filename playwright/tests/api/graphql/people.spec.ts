import { expect, test } from "@playwright/test";

// These tests depend on Kennedy family being loaded into Neo4j

test("GraphQL queries", async ({ request }) => {

  const jfk = await test.step("should find JFK", async () => {
    const response = await request.post("/api/graphql", {
      data: {
        query: `
          query FindPeople($query: String!) {
            people(query: $query) {
              id
              name
            }
          }
        `,
        variables: {
          query: "john fitzgerald kennedy"
        }
      }
    });

    expect(response.status()).toBe(200);

    const result = await response.json();

    // We should get 2 results - John Fitzgerald Kennedy and John Fitzgerald Kennedy Jr
    expect(result.data.people, "search result includes JFK father and son").toEqual(
      expect.arrayContaining([
        expect.objectContaining({"name": "John Fitzgerald Kennedy"}),
        expect.objectContaining({"name": "John Fitzgerald Kennedy Jr."})
      ])
    );
    // Get JFK record and query all information
    const jfk = result.data.people.find((p: any) => p.name === "John Fitzgerald Kennedy");

    // Double check :-)
    expect(jfk).toBeDefined();

    return jfk;
  });

  await test.step("should read JFK family", async () => {

    const response = await request.post("/api/graphql", {
      data: {
        query: `
          query GetPerson($id: ID!) {
            person(id: $id) {
              firstName
              surname
              birthDate
            }
            marriages(pid: $id) {
              beginDate
              wife {
                name
              }
              husband {
                id
              }
            }
            spouses(pid: $id) {
              name
            }
            children(pid: $id) {
              child {
                firstName
              }
              parent {
                id
              }
            }
            childrenOnly(pid: $id) {
              firstName
            }
            parents(pid: $id) {
              parent {
                name
              }
              child {
                id
              }
            }
            parentsOnly(pid: $id) {
              name
            }
            father(pid: $id) {
              name
            }
            mother(pid: $id) {
              name
            }
            siblings(pid: $id) {
              firstName
            }
          }
        `,
        variables: {
          id: jfk.id
        }
      }
    });

    const result = await response.json();

    expect(result.data.person, "JFK is John Kennedy born 1917-05-17").toEqual({
      "firstName": "John",
      "surname": "Kennedy",
      "birthDate": "1917-05-17"
    });

    expect(result.data.marriages, "JFK married Jacqueline").toEqual([{
      "beginDate": "1953-09-12",
      "wife": { "name": "Jacqueline Kennedy Onassis" },
      "husband": { "id": jfk.id }
    }]);

    expect(result.data.spouses, "JFK spouse is Jacqueline").toEqual([{
      "name": "Jacqueline Kennedy Onassis"
    }]);

    // children
    expect(result.data.children, "JFK has 4 children").toHaveLength(4);
    expect(result.data.children, "JFK children are Patrick, Arabella, Caroline and John").toEqual(
      expect.arrayContaining([
        {
          "child": { "firstName": "Patrick" },
          "parent": { "id": jfk.id }
        },
        {
          "child": { "firstName": "Arabella" },
          "parent": { "id": jfk.id }
        },
        {
          "child": { "firstName": "Caroline" },
          "parent": { "id": jfk.id }
        },
        {
          "child": { "firstName": "John" },
          "parent": { "id": jfk.id }
        }
      ]
    ));

    // childrenOnly
    expect(result.data.childrenOnly, "JFK has 4 children").toHaveLength(4);
    expect(result.data.childrenOnly, "JFK children are Patrick, Arabella, Caroline and John").toEqual(
      expect.arrayContaining([
        { "firstName": "Patrick" },
        { "firstName": "Arabella" },
        { "firstName": "Caroline" },
        { "firstName": "John" }
      ]
    ));

    // parents
    expect(result.data.parents, "JFK has 2 parents").toHaveLength(2);
    expect(result.data.parents, "JFK parents are Joseph and Rose").toEqual(
      expect.arrayContaining([
        {
          "parent": { "name": "Joseph Patrick Kennedy Sr." },
          "child": { "id": jfk.id }
        },
        {
          "parent": { "name": "Rose Elizabeth Kennedy" },
          "child": { "id": jfk.id }
        }
      ]
    ));

    // parentsOnly
    expect(result.data.parentsOnly, "JFK has 2 parents").toHaveLength(2);
    expect(result.data.parentsOnly, "JFK parents are Joseph and Rose").toEqual(
      expect.arrayContaining([
        { "name": "Joseph Patrick Kennedy Sr." },
        { "name": "Rose Elizabeth Kennedy" }
      ]
    ));

    // father
    expect(result.data.father, "JFK father is Joseph Patrick Kennedy Sr.").toEqual({
      "name": "Joseph Patrick Kennedy Sr."
    });

    // mother
    expect(result.data.mother, "JFK mother is Rose Elizabeth Kennedy").toEqual({
      "name": "Rose Elizabeth Kennedy"
    });

    // siblings
    expect(result.data.siblings, "JFK has 8 siblings").toHaveLength(8);
    expect(result.data.siblings, "JFK siblings are Joseph, Rose, Kathleen, Eunice, Patricia, Robert, Jean and Edward").toEqual(
      expect.arrayContaining([
        { "firstName": "Joseph" },
        { "firstName": "Rose" },
        { "firstName": "Kathleen" },
        { "firstName": "Eunice" },
        { "firstName": "Patricia" },
        { "firstName": "Robert" },
        { "firstName": "Jean" },
        { "firstName": "Edward" }
      ]
   ));

  });

});


