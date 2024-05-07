
/**
 * Utilities for server actions
 */

import type {
  Marriage,
  Parentage,
  Person,
  Sex
} from "./types"

import {
  type Node,
  type Relationship,
  parseNode,
  type RecordShape,
} from "../neo4j";
import dayjs from "dayjs";

export enum RelType {
  IS_MARRIED_TO = "IS_MARRIED_TO",
  IS_CHILD_OF = "IS_CHILD_OF"
}

export function makePerson(node: Node): Person {
  return {
    id: node.id,
    sex: node.labels.filter((l: string) => l == "Man" || l == "Woman")[0] as Sex,
    ...node.properties
  } as Person;
}

export function makeParentage(rel: Relationship): Parentage {
  // assert rel.type == RelType.IS_CHILD_OF
  return {
    id: rel.id,
    parent: makePerson(rel.targetNode),
    child: makePerson(rel.sourceNode),
  };
}

export function makeMarriage(rel: Relationship): Marriage {
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

export function parsePersonNode(node: RecordShape): Person {
  return Object.assign(
    {
      id: node.elementId,
      sex: node.labels.filter((l: string) => l == "Man" || l == "Woman")[0]
    },
    parseNode(node)
  ) as Person;
}

function toDateString(value: string|undefined): string|undefined {
  return value === undefined || value === null ? value
    : dayjs(value).format("YYYY-MM-DD");
}

export function toPersonObject(formData: FormData): Partial<Person> {
  const properties = toObject<Person>(formData, [
    "name", "firstName", "middleNames", "surname", "birthName", "birthDate", "deathDate", "nameDate"
  ]);

  // Convert dates - cut off time part
  return {
    ...properties,
    birthDate: toDateString(properties.birthDate),
    deathDate: toDateString(properties.deathDate),
    nameDate: toDateString(properties.nameDate)
  }
}

export function toMarriageObject(formData: FormData): Partial<Marriage> {
  const properties = toObject<Marriage>(formData, [
    "beginDate", "endDate", "endCause"
  ]);
  return {
    ...properties,
    beginDate: toDateString(properties.beginDate),
    endDate: toDateString(properties.endDate)
  }
}

function toObject<T>(formData: FormData, validProperties: string[]): Partial<T> {
  const fullHash = Object.fromEntries(formData.entries());
  return Object.fromEntries(
    Object.entries(fullHash).filter(
      ([key, value]) => validProperties.includes(key)
    )
  ) as Partial<T>;
}
