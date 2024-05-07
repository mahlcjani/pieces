
import dayjs from "dayjs";
import neo4j, {
  type RecordShape,
  Driver,
  QueryResult,
  Session,
  Transaction,
  ManagedTransaction,
  isDate,
  isInt
} from "neo4j-driver"

// Temporary expose neo4j interface
export {
  default as neo4j,
  type RecordShape,
  type QueryResult
} from "neo4j-driver";

// Properties are not exported :(
export type Properties = {
  [key: string]: any;
}

export type Node = {
  id: string;
  labels: Array<string>;
  properties: Properties;
}

export enum RelDirection {
  IN,
  OUT,
  NO
}

export type Relationship = {
  id: string;
  type: string;
  properties: Properties;
  sourceNode: Node;
  targetNode: Node;
}

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

export async function getSession(): Promise<Session> {
  return (await getDriver()).session({
    database: process.env.NEO4J_DATABASE || "neo4j"
  });
}

export const filterInteger = (value: any): Object => {
  // This application is not using big numbers so toInt() conversion is just fine
  return isInt(value) ? value.toInt() : value;
}

export const filterDate = (value: any): Object => {
  return isDate<number>(value) ? dayjs(value.toStandardDate()).format("YYYY-MM-DD") : value;
}

// Convert from neo4j types (only used, though)
export const filterObject = (value: any): Object => {
  return filterDate(filterInteger(value));
}

export const parseNode = (node: RecordShape<string, any>): Object => {
  if (node.properties !== undefined) {
    return Object.fromEntries(
      Object.entries(node.properties).map(
        ([key, val]) => [key, filterObject(val)])
    );
  }
  // Is empty object really the best option?
  return {};
}

/**
 * Read person relationships.
 *
 * @param personId
 * @param type
 * @returns
 */
export async function fetchNodeRelatonships(nodeId: string, type: string, direction: RelDirection): Promise<Relationship[]> {
  function path(direction: RelDirection) {
    switch (direction) {
      case RelDirection.OUT:
        return `MATCH (node)-[rel:${type}]->(other)`;
      case RelDirection.IN:
        return `MATCH (node)<-[rel:${type}]-(other)`;
      case RelDirection.NO:
        return `MATCH (node)-[rel:${type}]-(other)`;
    }
  }

  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        ${path(direction)}
        WHERE elementId(node) = $id
        RETURN rel, node, other`,
        {
          id: nodeId
        }
      )
    );

    console.log(result.records);

    return result.records.map(row => {
      const rel = row.get("rel");
      console.log(rel);

      const source = direction == RelDirection.IN ? row.get("other") : row.get("node");
      const target = direction == RelDirection.IN ? row.get("node") : row.get("other");
      return {
        id: rel.elementId,
        type: rel.type,
        properties: parseNode(rel),
        sourceNode: {
          id: source.elementId,
          labels: source.labels,
          properties: parseNode(source)
        },
        targetNode: {
          id: target.elementId,
          labels: target.labels,
          properties: parseNode(target)
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

/**
 * Read relationship.
 *
 * @param id relationship id
 * @returns
 */
export async function fetchNodeRelatonship(relId: string): Promise<Relationship|undefined> {
  const session = await getSession();

  try {
    const result: QueryResult<RecordShape> = await session.executeRead(tx =>
      tx.run(`
        MATCH (source)-[rel]->(target)
        WHERE elementId(rel) = $id
        RETURN rel, source, target`,
        {
          id: relId
        }
      )
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
    console.log(e)
  }
  finally {
    await session.close()
  }

  return undefined;
}

// readNode
// readRel
// updateNode
// updateRel
// deleteNode
// deleteRel


// Generic interface
type TransactionWork<T> = (tx: Transaction) => Promise<T> | T;
type ManagedTransactionWork<T> = (tx: ManagedTransaction) => Promise<T> | T;

export async function executeRead(work: ManagedTransactionWork<QueryResult<RecordShape>>): Promise<QueryResult<RecordShape>|undefined> {
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
