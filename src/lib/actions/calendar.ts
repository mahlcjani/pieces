"use server"

/**
 * Server side actions for calendar
 */

import dayjs from "dayjs";

import {
  type RecordShape,
  type QueryResult,
  getSession,
} from "../neo4j";

import { parsePersonNode } from "./support";

import { unstable_noStore as noStore } from "next/cache";

/**
 * Find events for calendar.
 *
 * @param since start date
 * @param until end date
 * @returns
 */
export async function fetchEvents(since: string|Date, until: string|Date = since) {
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
          start: dayjs(since).format("YYYY-MM-DD"),
          end: dayjs(until).format("YYYY-MM-DD")
        }
      )
    );

    console.log(result);
    console.log(result.records);

    return result.records.map(row => {
      return {
        date: dayjs(row.get("eventDate").toStandardDate()).format("YYYY-MM-DD"),
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
