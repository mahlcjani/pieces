//"use server"

import neo4j, {
  Date as Neo4jDate,
  Driver,
  Integer as Neo4jInteger,
  Node as Neo4jNode,
  type RecordShape,
  QueryResult,
  Session,
  Transaction,
  ManagedTransaction,
  isDate
} from "neo4j-driver"

// Temporary expose neo4j interface
export {
  default as neo4j,
  type RecordShape,
  type QueryResult
} from "neo4j-driver";

import { unstable_noStore as noStore } from "next/cache";

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

// Convert neo4j date to javascript date
// (todo - incorporate numbers)
export const parseNode = (node: RecordShape<string, any>): Object => {
  if (node.properties !== undefined) {
    return Object.fromEntries(
      Object.entries(node.properties).map(
        ([key, val]) => [key, isDate(val) ? val.toStandardDate() : val])
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
  noStore();

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
  noStore();

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
