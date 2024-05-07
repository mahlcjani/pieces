"use server"

/**
 * Server side actions for people management
 */

import type {
  Marriage,
  Parentage,
  Person
} from "./types"

import {
  RelType,
  makeMarriage,
  makeParentage,
  parsePersonNode,
  toMarriageObject,
  toPersonObject
} from "./support";

import {
  type RecordShape,
  type QueryResult,
  getSession,
  parseNode,
  neo4j,
  RelDirection,
  fetchNodeRelatonships,
  fetchNodeRelatonship,
  executeRead
} from "../neo4j";

import dayjs from "dayjs";
import { unstable_noStore as noStore } from "next/cache";

/**
 * Find people matching search criteria.
 *
 * @param query
 * @param offset
 * @param limit
 * @returns
 */
export async function fetchPeople(query: string, offset: number, limit: number) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)
        WHERE (
          person.name =~ $query OR
          person.firstName =~ $query OR
          person.surname =~ $query OR
          person.birthName =~ $query
        )
        RETURN person
        ORDER BY person.name, person.surname, person.firstName
        SKIP $offset LIMIT $limit`,
        {
          query: "(?i).*" + query + ".*",
          offset: neo4j.int(offset),
          limit: neo4j.int(limit)
        }
      )
    );

    console.log(result);

    return result.records.map(row => parsePersonNode(row.get("person")));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

/**
 * Count people matching search criteria.
 *
 * @param query
 * @returns
 */
export async function countPeople(query: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)
        WHERE (
          person.name =~ $query OR
          person.firstName =~ $query OR
          person.surname =~ $query OR
          person.birthName =~ $query
        )
        RETURN count(person) AS count`,
        {
          query: "(?i).*" + query + ".*"
        }
      )
    );

    return result.records[0].get("count");
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return 0;
}

/**
 * Fetch person properties.
 *
 * @param id - person identifier
 * @returns promise resolving to Person object
 */
export async function fetchPerson(id: string): Promise<Person|undefined> {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)
        WHERE elementId(person) = $id
        RETURN person`,
        { id: id }
      )
    );

    return result.records.map(row => parsePersonNode(row.get("person"))).at(0);
  }
  catch (e) {
    console.log(e);
  }
  finally {
    await session.close()
  }

  return undefined;
}

/**
 * Fetch marriages of a given person.
 *
 * @param id - person identifier
 * @returns promise resolving to an array of Marriage objects.
 */
export async function fetchMarriages(personId: string) : Promise<Marriage[]> {
  return (await fetchNodeRelatonships(personId, RelType.IS_MARRIED_TO, RelDirection.NO)).map(
    rel => makeMarriage(rel)
  );
}

/**
 * Fetch children of a given person.
 *
 * @param id - parent identifier
 * @returns promise resolving to an array of Parentage objects.
 */
export async function fetchChildren(personId: string) : Promise<Parentage[]> {
  return (await fetchNodeRelatonships(personId, RelType.IS_CHILD_OF, RelDirection.IN)).map(
    rel => makeParentage(rel)
  );
}

/**
 * Fetch parents of a given person.
 *
 * @param id - child identifier
 * @returns promise resolving to an array of Parentage objects.
 */
export async function fetchParents(personId: string) : Promise<Parentage[]> {
  return (await fetchNodeRelatonships(personId, RelType.IS_CHILD_OF, RelDirection.OUT)).map(
    rel => makeParentage(rel)
  );
}

/**
 * Fetch siblings of a given person.
 *
 * @param id - person identifier
 * @returns promise resolving to an array of Person objects.
 */
export async function fetchSiblings(id: string): Promise<Person[]> {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)-[:${RelType.IS_CHILD_OF}]->(parent:Person)<-[:${RelType.IS_CHILD_OF}]-(sibling:Person)
        WHERE elementId(person) = $id
        RETURN DISTINCT sibling
        ORDER BY sibling.birthDate`,
        {
          id: id
        }
      )
    );

    return result.records.map(row => parsePersonNode(row.get("sibling")));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

/**
 * Fetch marriage of a given id.
 *
 * @param id - marriage identifier
 * @returns promise resolving to a Marriage object.
 */
export async function fetchMarriage(id: string) : Promise<Marriage> {
  const rel = await fetchNodeRelatonship(id);
  if (rel === undefined) {
    throw new Error("Marriage of a specified id is not existing!");
  }
  return makeMarriage(rel);
}

/**
 * Fetch parentage of a given id.
 *
 * @param id - parentage relationship identifier
 * @returns promise resolving to a Parentage object.
 */
export async function fetchParentage(id: string) : Promise<Parentage> {
  const rel = await fetchNodeRelatonship(id);
  if (rel === undefined) {
    throw new Error("Parentage (parent-child relation) of a specified id is not existing!");
  }
  return makeParentage(rel);
}

export async function createPerson(sex: string, formData: FormData): Promise<Person|undefined> {
  noStore();

  const properties = toPersonObject(formData);

  console.log(`About to create ${sex} with properties`);
  console.log(properties);

  function cypher(key: string, value: string|object) {
    return value !== undefined
      ? value ? key.endsWith("Date") ? `${key}:date(\$${key}),`
                                     : `${key}:\$${key},`
              : `${key}:null,`
      : "";
  }

  // Create cypher query
  let stmt = `CREATE (person:Person:${sex} {`;
  for (const [key, value] of Object.entries(properties)) {
    stmt += cypher(key, value);
  }
  stmt = stmt.slice(0, -1) + "}) RETURN person";
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {...properties})
    );

    console.log(result);

    return result.records.map(row => parsePersonNode(row.get("person"))).at(0);
  }
  catch (e) {
    console.log(e)
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function updatePerson(id: string, formData: FormData): Promise<Person|undefined> {
  noStore();

  const properties = toPersonObject(formData);

  console.log(`About to update person of id ${id} with properties`);
  console.log(properties);

  // Logic for undefined vs null -
  // if property is undefined - leave it unchanged
  // if property is null - clear it

  function cypher(node: string, key: string, value: string|object) {
    return value !== undefined
      ? value ? key.endsWith("Date") ? `${node}.${key}=date(\$${key}),`
                                     : `${node}.${key}=\$${key},`
              : `${node}.${key}=null,`
      : "";
  }

  // Create cypher query
  let stmt = "MATCH (person:Person) WHERE elementId(person) = $id SET ";
  for (const [key, value] of Object.entries(properties)) {
    stmt += cypher("person", key, value);
  }
  stmt = stmt.slice(0, -1) + " RETURN person";
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {
        ...properties,
        id: id,
        nameDate: properties.nameDate ? dayjs(properties.nameDate).format("YYYY-MM-DD") : null
      })
    );

    console.log(result);

    return result.records.map(row => parsePersonNode(row.get("person"))).at(0);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function deletePerson(id: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run("MATCH (person:Person) WHERE elementId(person) = $id DETACH DELETE person", {id: id})
    );

    console.log(result);
    console.log(result.summary);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function createParentage(parent: string, child: string) {
  const rel: RecordShape = createRel(child, parent, RelType.IS_CHILD_OF, {});
  return { id: rel.elementId };
}

export async function createMarriage(person: string, spouse: string, formData: FormData) {
  const rel: RecordShape = createRel(person, spouse, RelType.IS_MARRIED_TO, formData ? toMarriageObject(formData) : {});
  return {
    id: rel.elementId,
    ...parseNode(rel)
  }
}

async function createRel(p1: string, p2: string, rel: RelType, properties: any): Promise<RecordShape> {
  noStore();

  console.log(`About to create relation ${rel} with properties`);
  console.log({p1: p1, p2: p2, ...properties});

  function cypher(key: string, value: string|object) {
    return typeof value !== "undefined"
      ? value ? key.endsWith("Date") ? `${key}:date(\$${key}),`
                                     : `${key}:\$${key},`
              : `${key}:null,`
      : "";
  }

  // Create cypher query
  let stmt = `
    MATCH (p1:Person) WHERE elementId(p1) = $p1
    MATCH (p2:Person) WHERE elementId(p2) = $p2
    CREATE (p1)-[rel:${rel}`;

    if (properties) {
    stmt += " { ";
    Object.keys(properties).forEach((key) => {
      stmt += cypher(key, properties[key]);
    });
    stmt = stmt.slice(0, -1) + "}";
  }
  stmt += "]->(p2) RETURN rel";
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {p1: p1, p2: p2, ...properties})
    );

    console.log(result);
    console.log(result.summary);

    return result.records[0].get("rel");
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function updateMarriage(id: string, formData: FormData) {
  const rel: RecordShape = updateRel(id, formData ? toMarriageObject(formData) : {});
  return {
    id: rel.elementId,
    ...parseNode(rel)
  }
}

// TODO: load persons
export async function updateRel(id: string, properties: any): Promise<RecordShape> {
  noStore();

  console.log(`About to update node ${id} with properties`);
  console.log(properties);

  function cypher(node: string, key: string, value: string|object) {
    return value !== undefined
      ? value ? key.endsWith("Date") ? `${node}.${key}=date(\$${key}),`
                                     : `${node}.${key}=\$${key},`
              : `${node}.${key}=null,`
      : "";
  }

  // Create cypher query
  let stmt = "MATCH ()-[rel]->() WHERE elementId(rel) = $id SET ";
  Object.keys(properties).forEach((key) => {
    stmt += cypher("rel", key, properties[key]);
  });
  stmt = stmt.slice(0, -1) + " RETURN rel";
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {...properties, id: id})
    );

    console.log(result);

    return result.records[0].get("rel");
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function deleteRel(id: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(`
        MATCH (source)-[rel]->(target)
        WHERE elementId(rel) = $id
        DELETE rel
        RETURN source, rel, target`,
        {id: id})
    );

    return result.records.map(row => {
      const rel = row.get("rel");
      const source = row.get("source");
      const target = row.get("target");
      return {
        id: rel.elementId,
        type: rel.type,
        properties: parseNode(rel.properties),
        sourceNode: {
          id: source.elementId,
          labels: source.labels,
          properties: parseNode(source.properties)
        },
        targetNode: {
          id: target.elementId,
          labels: target.labels,
          properties: parseNode(target.properties)
        }
      }
    }).at(0);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function deleteParentage(parent: string, child: string) {
  deleteRel_(child, parent, RelType.IS_CHILD_OF);
}

export async function deleteMarriage(person: string, spouse: string) {
  deleteRel_(person, spouse, RelType.IS_MARRIED_TO);
}

async function deleteRel_(p1: string, p2: string, rel: string) {
  noStore();

  console.log(`About to delete relation ${rel} with properties`);
  console.log({p1: p1, p2: p2});

  let stmt = `
    MATCH (p1:Person)-[rel:${rel}]-(p2:Person)
    WHERE elementId(p1) = $p1 AND elementId(p2) = $p2
    DELETE rel
  `;
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {p1: p1, p2: p2})
    );

    console.log(result);
    console.log(result.summary);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

// Find possible spouses
// TODO: incorporate dates for marriage (if person is married, cannot marry new one)
export async function suggestSpouses(query: string, personId: string, spouseSex: string, bornAfter?: string|Date, bornBefore?: string|Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person:${spouseSex})
        WHERE not ((person)-[:${RelType.IS_MARRIED_TO}]-())
         AND (person.name =~ $query OR person.firstName =~ $query OR person.surname =~ $query)
         AND elementId(person) <> $id
         AND date($bornBefore) > person.birthDate >= date($bornAfter)
        RETURN person
        ORDER BY person.surname, person.firstName
        SKIP $offset LIMIT $limit`,
        {
          id: personId,
          // Use date from the past if not specified
          bornAfter: (bornAfter ? dayjs(bornAfter) : dayjs("0001-01-01")).format("YYYY-MM-DD"),
          // Use today if not specified
          bornBefore: (bornBefore ? dayjs(bornBefore) : dayjs()).format("YYYY-MM-DD"),
          query: "(?i).*" + query + ".*",
          offset: neo4j.int(0),
          limit: neo4j.int(6)
        }
      )
    );

    console.log(result);
    console.log(result.summary);

    return result.records.map(row => parsePersonNode(row.get("person")));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

export async function suggestChildren(query: string, parentId: string, parentSex: string, bornAfter?: string|Date, bornBefore?: string|Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)
        WHERE not ((person)-[:${RelType.IS_CHILD_OF}]->(:Person:${parentSex}))
         AND (
           person.name =~ $query OR
           person.firstName =~ $query OR
           person.surname =~ $query OR
           person.birthName =~ $query
         )
         AND elementId(person) <> $id
         AND date($bornBefore) > person.birthDate >= date($bornAfter)
        RETURN person
        ORDER BY person.surname, person.firstName
        SKIP $offset LIMIT $limit`,
        {
          id: parentId,
          // Use date from the past if not specified
          bornAfter: (bornAfter ? dayjs(bornAfter) : dayjs("0001-01-01")).format("YYYY-MM-DD"),
          // Use today if not specified
          bornBefore: (bornBefore ? dayjs(bornBefore) : dayjs()).format("YYYY-MM-DD"),
          query: "(?i).*" + query + ".*",
          offset: neo4j.int(0),
          limit: neo4j.int(6)
        }
      )
    );

    console.log(result);
    console.log(result.summary);

    return result.records.map(row => parsePersonNode(row.get("person")));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

export async function suggestChildren_(parentId: string, parentSex: string, bornAfter: string|Date, bornBefore: string|Date, query: string) {
  const result: any = executeRead(tx =>
    tx.run(`
      MATCH (person:Person)
      WHERE not ((person)-[:${RelType.IS_CHILD_OF}]->(:Person:${parentSex}))
       AND (person.name =~ $query OR person.firstName =~ $query OR person.surname =~ $query)
       AND elementId(person) <> $id
       AND date($bornBefore) > person.birthDate >= date($bornAfter)
      RETURN person
      ORDER BY person.surname, person.firstName
      SKIP $offset LIMIT $limit`,
      {
        id: parentId,
        // Use date from the past if not specified
        bornAfter: (bornAfter ? dayjs(bornAfter) : dayjs("0001-01-01")).format("YYYY-MM-DD"),
        // Use today if not specified
        bornBefore: (bornBefore ? dayjs(bornBefore) : dayjs()).format("YYYY-MM-DD"),
        query: "(?i).*" + query + ".*",
        offset: neo4j.int(0),
        limit: neo4j.int(6)
      }
    )
  );

  return result.records.map((row: RecordShape) => parsePersonNode(row.get("person")));
}
