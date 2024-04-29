"use server"

import type {
  Marriage,
  Parentage,
  Person,
  Sex
} from "@/lib/data.d"

import {
  type Node,
  type Relationship,
  getSession,
  parseNode,
  neo4j,
  type RecordShape,
  type QueryResult,
  RelDirection,
  fetchNodeRelatonships,
  fetchNodeRelatonship,
  executeRead
} from "./neo4j";

import { unstable_noStore as noStore } from "next/cache";

enum RelType {
  IS_MARRIED_TO = "IS_MARRIED_TO",
  IS_CHILD_OF = "IS_CHILD_OF"
}

function makePerson(node: Node): Person {
  return {
    id: node.id,
    sex: node.labels.filter((l: string) => l == "Man" || l == "Woman")[0] as Sex,
    ...node.properties
  } as Person;
}

function makeParentage(rel: Relationship): Parentage {
  // assert rel.type == RelType.IS_CHILD_OF
  return {
    id: rel.id,
    parent: makePerson(rel.targetNode),
    child: makePerson(rel.sourceNode),
  };
}

function makeMarriage(rel: Relationship): Marriage {
  // assert rel.type == RelType.IS_MARRIED_TO
  const source: Person = makePerson(rel.sourceNode);
  const target: Person = makePerson(rel.targetNode);
  // assert both wife and husband are set
  return {
    id: rel.id,
    ...rel.properties,
    wife: source.sex == "Man" ? target : source,
    husband: source.sex == "Man" ? source : target,
  } as Marriage;
}

function parsePersonNode(node: RecordShape): Person {
  return Object.assign(
    {
      id: node.elementId,
      sex: node.labels.filter((l: string) => l == "Man" || l == "Woman")[0]
    },
    parseNode(node)
  ) as Person;
}

/**
 * Find events for calendar.
 *
 * @param since start date
 * @param until end date
 * @returns
 */
export async function fetchEvents(since: Date, until: Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape<string, any>> = await session.executeRead(tx =>
      tx.run(`
        WITH date($start) AS start, date($end) AS end
        UNWIND [days IN range(0, duration.inDays(start, end).days) |
          start + duration({days:days})] AS day
        MATCH (w:Woman)-[m:IS_MARRIED_TO]-(p)
        WHERE day > m.beginDate AND m.beginDate.month = day.month AND m.beginDate.day = day.day
        WITH *, {person: w} AS wife, {person: p} AS husband
        RETURN "Marriage" AS eventType,
          day AS eventDate,
          duration.between(m.beginDate, day).years AS anniversary,
          [wife, husband] AS people
        UNION
        WITH date($start) AS start, date($end) AS end
        UNWIND [days IN range(0, duration.inDays(start, end).days) |
          start + duration({days:days})] AS day
        MATCH (p:Person)
        WHERE day > p.birthDate AND p.birthDate.month = day.month AND p.birthDate.day = day.day
        WITH *, {person: p} AS person
        RETURN "Birthday" AS eventType,
          day AS eventDate,
          duration.between(p.birthDate, day).years AS anniversary,
          [person] AS people
        UNION
        WITH date($start) AS start, date($end) AS end
        UNWIND [days IN range(0, duration.inDays(start, end).days) |
          start + duration({days:days})] AS day
        MATCH (p:Person)
        WHERE day > p.birthDate AND p.nameDate.month = day.month AND p.nameDate.day = day.day
        WITH *, {person: p} AS person
        RETURN "Nameday" AS eventType,
          day AS eventDate,
          0 AS anniversary,
          [person] AS people`,
        {
          start: since.toJSON().slice(0, 10),
          end: until.toJSON().slice(0, 10)
        }
      )
    );

    console.log(result);
    console.log(result.records);

    return result.records.map(row => {
      return {
        date: row.get("eventDate").toStandardDate(),
        type: row.get("eventType"),
        cardinality: row.get("anniversary").toNumber(),
        people: row.get("people").map((element: RecordShape) => parsePersonNode(element.person))
      }
    });
  }
  catch (e) {
    console.log(e);
  }
  finally {
    await session.close();
  }

  return [];
}

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
        MATCH (person:Person)-[:IS_CHILD_OF]->(parent:Person)<-[:IS_CHILD_OF]-(sibling:Person)
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

function toPersonObject(formData: FormData): any {
  return toObject(formData, [
    "name", "firstName", "middleNames", "surname", "birthName", "birthDate", "deathDate", "nameDate"
  ]);
}

function toMarriageObject(formData: FormData): any {
  return toObject(formData, [
    "beginDate", "endDate", "endCause"
  ]);
}

function toObject(formData: FormData, validProperties: string[]): any {
  const fullHash = Object.fromEntries(formData.entries());
  console.log(`${fullHash}`)

  return Object.fromEntries(
    Object.entries(fullHash).filter(
      ([key, value]) => validProperties.includes(key)
    )
  );
}

export async function createPerson(sex: string, formData: FormData): Promise<Person|undefined> {
  noStore();

  const properties = toPersonObject(formData);

  console.log(`About to create ${sex} with properties`);
  console.log(properties);

  function cypher(key: string, value: string|object) {
    return typeof value !== "undefined"
      ? value ? key.endsWith("Date") ? `${key}:date(\$${key}),`
                                     : `${key}:\$${key},`
              : `${key}:null,`
      : "";
  }

  // Create cypher query
  let stmt = `CREATE (person:Person:${sex} {`;
  Object.keys(properties).forEach((key) => {
    stmt += cypher(key, properties[key]);
  });
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
    return typeof value !== "undefined"
      ? value ? key.endsWith("Date") ? `${node}.${key}=date(\$${key}),`
                                     : `${node}.${key}=\$${key},`
              : `${node}.${key}=null,`
      : "";
  }

  // Create cypher query
  let stmt = "MATCH (person:Person) WHERE elementId(person) = $id SET ";
  Object.keys(properties).forEach((key) => {
    stmt += cypher("person", key, properties[key]);
  });
  stmt = stmt.slice(0, -1) + " RETURN person";
  console.log(stmt);

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeWrite(tx =>
      tx.run(stmt, {...properties, id: id})
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
    beginDate: rel.properties?.beginDate?.toStandardDate(),
    endDate: rel.properties?.endDate?.toStandardDate(),
    endCause: rel.properties?.endCause
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
  console.log(rel);

  //return makeMarriage(rel);


  return {
    id: rel.elementId,
    beginDate: rel.properties?.beginDate?.toStandardDate(),
    endDate: rel.properties?.endDate?.toStandardDate(),
    endCause: rel.properties?.endCause
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
  deleteRel_(child, parent, "IS_CHILD_OF");
}

export async function deleteMarriage(person: string, spouse: string) {
  deleteRel_(person, spouse, "MARRIED_TO");
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
export async function suggestSpouses(query: string, personId: string, spouseSex: string, bornAfter?: Date, bornBefore?: Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person:${spouseSex})
        WHERE not ((person)-[:IS_MARRIED_TO]-())
         AND (person.name =~ $query OR person.firstName =~ $query OR person.surname =~ $query)
         AND elementId(person) <> $id
         AND date($bornBefore) > person.birthDate >= date($bornAfter)
        RETURN person
        ORDER BY person.surname, person.firstName
        SKIP $offset LIMIT $limit`,
        {
          id: personId,
          // hacks on dates
          bornAfter: (bornAfter ? bornAfter : new Date("996-01-01")).toJSON().slice(0, 10),
          bornBefore: (bornBefore ? bornBefore : new Date()).toJSON().slice(0, 10),
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

export async function suggestChildren(query: string, parentId: string, parentSex: string, bornAfter?: Date, bornBefore?: Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)
        WHERE not ((person)-[:IS_CHILD_OF]->(:Person:${parentSex}))
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
          // hacks on dates
          bornAfter: (bornAfter ? bornAfter : new Date("996-01-01")).toJSON().slice(0, 10),
          bornBefore: (bornBefore ? bornBefore : new Date()).toJSON().slice(0, 10),
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

export async function suggestChildren_(parentId: string, parentSex: string, bornAfter: Date, bornBefore: Date, query: string) {
  const result: any = executeRead(tx =>
    tx.run(`
      MATCH (person:Person)
      WHERE not ((person)-[:IS_CHILD_OF]->(:Person:${parentSex}))
       AND (person.name =~ $query OR person.firstName =~ $query OR person.surname =~ $query)
       AND elementId(person) <> $id
       AND date($bornBefore) > person.birthDate >= date($bornAfter)
      RETURN person
      ORDER BY person.surname, person.firstName
      SKIP $offset LIMIT $limit`,
      {
        id: parentId,
        // hacks on dates
        bornAfter: (bornAfter ? bornAfter : new Date("996-01-01")).toJSON().slice(0, 10),
        bornBefore: (bornBefore ? bornBefore : new Date()).toJSON().slice(0, 10),
        query: "(?i).*" + query + ".*",
        offset: neo4j.int(0),
        limit: neo4j.int(6)
      }
    )
  );

  return result.records.map((row: RecordShape) => parsePersonNode(row.get("person")));
}
