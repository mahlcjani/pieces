"use server"

import neo4j, {
  Date as Neo4jDate,
  Driver,
  RecordShape,
  QueryResult,
  Session,
  Transaction,
  ManagedTransaction
} from "neo4j-driver"

import { type Anniversary, type Person } from "@/lib/data.d"
import { unstable_noStore as noStore } from "next/cache";

let driver: Driver

async function getDriver(): Promise<Driver> {
  if (!driver) {
    driver = neo4j.driver(
      process.env.NEO4J_URL || "neo4j://localhost:7687",
      neo4j.auth.basic(
        process.env.NEO4J_USERNAME || "neo4j",
        process.env.NEO4J_PASSWORD || "nosecret"
      )
    )

    await driver.getServerInfo()
  }

  return driver
}

async function getSession(): Promise<Session> {
  return (await getDriver()).session({
    database: process.env.NEO4J_DATABASE || "neo4j"
  });
}

function safeDate(date: Neo4jDate|undefined, __debug__: string[]) {
  try {
    return date?.toStandardDate();
  } catch (e) {
    console.log(`${__debug__}: Error for ${date} (${typeof date})`)
    console.log(e);
    return null;
  }
}

function parsePersonNode(node: RecordShape): Person {
  return {
    id: node.elementId,
    sex: node.labels.includes("Woman") ? "Woman" : "Man",
    ...node.properties,
    birthDate: safeDate(node.properties.birthDate, [node.properties.name, "birthDate"]),
    nameDate: safeDate(node.properties.nameDate, [node.properties.name, "nameDate"]),
    deathDate: safeDate(node.properties.deathDate, [node.properties.name, "deathDate"])
  }
}

export async function fetchYearEvents(year: number): Promise<Anniversary[]> {
  return fetchEvents(new Date(year, 1, 1), new Date(year+1, 1, 1));
}

export async function fetchMonthEvents(year: number, month: number): Promise<Anniversary[]> {
  // todo deal with december
  return fetchEvents(new Date(year, month, 1), new Date(year, month+1, 1));
}

export async function fetchDayEvents(year: number, month: number, day: number): Promise<Anniversary[]> {
  // to do - deal with end of month
  return fetchEvents(new Date(year, month, day), new Date(year, month, day+1));
}

export async function fetchEvents(since: Date, until: Date) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        WITH date($start) AS start, date($end) AS end
        UNWIND [days IN range(0, duration.inDays(start, end).days) |
          start + duration({days:days})] AS day
        MATCH (w:Woman)-[m:MARRIED_TO]-(p)
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

export async function fetchChildren(id: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (child:Person)-[:IS_CHILD_OF]->(person:Person)
        WHERE elementId(person) = $id
        RETURN child
        ORDER BY child.birthDate`,
        { id: id }
      )
    );

    return result.records.map(row => parsePersonNode(row.get("child")/*, row.get("rel")*/));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

export async function fetchParents(id: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)-[:IS_CHILD_OF]->(parent:Person)
        WHERE elementId(person) = $id
        RETURN parent`,
        {
          id: id
        }
      )
    );

    return result.records.map(row => parsePersonNode(row.get("parent")));
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

export async function fetchSpouses(id: string) {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (person:Person)-[rel:MARRIED_TO]-(spouse:Person)
        WHERE elementId(person) = $id
        RETURN spouse, rel
        ORDER BY rel.beginDate`,
        {
          id: id
        }
      )
    );

    return result.records.map(row => {
      const spouse = row.get("spouse");
      const rel = row.get("rel");
      return {
        id: spouse.elementId,
        sex: spouse.labels.includes("Woman") ? "Woman" : "Man",
        ...spouse.properties,
        birthDate: spouse.properties.birthDate?.toStandardDate(),
        nameDate: spouse.properties.nameDate?.toStandardDate(),
        deathDate: spouse.properties.deathDate?.toStandardDate(),
        rel: {
          id: rel.elementId,
          beginDate: rel.properties.beginDate?.toStandardDate(),
          endDate: rel.properties.endDate?.toStandardDate(),
          endCause: rel.properties.endCause
        }
      }
    });
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }

  return [];
}

export async function fetchSiblings(id: string) {
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

function toPersonObject(formData: FormData): any {
  return toObject(formData, [
    "name", "firstName", "surname", "birthDate", "deathDate", "nameDate"
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

// [: string]: any

export async function createChildRel(parent: string, child: string) {
  const rel: RecordShape = createRel(child, parent, "IS_CHILD_OF", {});
  console.log(rel);
  return { id: rel.elementId };
}

export async function createSpouseRel(person: string, spouse: string, formData: FormData) {
  const rel: RecordShape = createRel(person, spouse, "MARRIED_TO", formData ? toMarriageObject(formData) : {});
  console.log(rel);
  return {
    id: rel.elementId,
    beginDate: rel.properties?.beginDate?.toStandardDate(),
    endDate: rel.properties?.endDate?.toStandardDate(),
    endCause: rel.properties?.endCause
  }
}

async function createRel(p1: string, p2: string, rel: "IS_CHILD_OF"|"MARRIED_TO", properties: any): Promise<RecordShape> {
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

export async function updateSpouseRel(id: string, formData: FormData) {
  const rel: RecordShape = updateRel(id, formData ? toMarriageObject(formData) : {});
  console.log(rel);
  return {
    id: rel.elementId,
    beginDate: rel.properties?.beginDate?.toStandardDate(),
    endDate: rel.properties?.endDate?.toStandardDate(),
    endCause: rel.properties?.endCause
  }
}

export async function updateRel(id: string, properties: any): Promise<RecordShape> {
  noStore();

  console.log(`About to update node ${id} with properties`);
  console.log(properties);

  function cypher(node: string, key: string, value: string|object) {
    return typeof value !== "undefined"
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
      tx.run("MATCH ()-[rel]->() WHERE elementId(rel) = $id DELETE rel", {id: id})
    );

    console.log(result);
  }
  catch (e) {
    console.log(e);
    throw e;
  }
  finally {
    await session.close()
  }
}

export async function deleteChildRel(parent: string, child: string) {
  deleteRel_(child, parent, "IS_CHILD_OF");
}

export async function deleteSpouseRel(person: string, spouse: string) {
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
        WHERE not ((person)-[:MARRIED_TO]-())
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

// Generic interface
type TransactionWork<T> = (tx: Transaction) => Promise<T> | T;
type ManagedTransactionWork<T> = (tx: ManagedTransaction) => Promise<T> | T;

async function executeRead(work: ManagedTransactionWork<QueryResult<RecordShape>>): Promise<QueryResult<RecordShape>|undefined> {
  noStore();

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(work);
    console.log(result);
    return result;
  }
  catch (e) {
    console.log(e)
  }
  finally {
    await session.close()
  }
  return undefined;
}

type Node = {
  labels: string[];
  properties: object;
}

function createNode1(node: Node): object|undefined {
  const { labels, properties } = node;
  return createNode2(properties, labels);
}

function createNode2(node: object, labels: string[]): object|undefined {
  return undefined;
}
