"use server"

/**
 * Server side actions for calendar
 */

import dayjs from "../dayjs";

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

  // make one or two searches depending on date

  const start = dayjs(since);
  const end = dayjs(until);

  // check no longer than year
  if (!end.isAfter(start)) {
    // TODO: wrong can be also equal!
    throw `${until} should be after ${start}}`;
  }

  if (end.diff(start, "day") > 366 || start.isLeapYear() && end.diff(start, "day") > 367) {
    throw "to wide range"
  }

  if (end.year() > start.year()) {
    // 2 searches
    const split = dayjs(new Date(end.year(), 0, 1));
    console.log(`${start}-${split}`)
    console.log(`${split}-${end}`)


    return (await fetchEvents_(start, split)).concat(await fetchEvents_(split, end));

  } else {
    console.log(`${start}-${end}`)
    return await fetchEvents_(start, end);

  }



}

async function fetchEvents_(since: dayjs.Dayjs, until: dayjs.Dayjs) {


  const session = await getSession();

  try {
    const result: QueryResult<RecordShape<string, any>> = await session.executeRead(tx =>
      tx.run(`
      CALL {
        WITH date($start) AS start, date($end) AS end
        MATCH (w:Woman)-[m:IS_MARRIED_TO]-(p)
        WHERE m.beginDate IS NOT NULL
          AND start <= date({year: start.year, month: m.beginDate.month, day: m.beginDate.day}) <= end
        WITH *, {person: w} AS wife, {person: p} AS husband, date({year: start.year, month: m.beginDate.month, day: m.beginDate.day}) AS eventDate
        RETURN "Marriage" AS eventType,
            eventDate,
            duration.between(m.beginDate, eventDate).years AS anniversary,
            [wife, husband] AS people
        UNION
        WITH date($start) AS start, date($end) AS end
        MATCH (p:Person)
        WHERE p.birthDate IS NOT NULL
          AND start <= date({year: start.year, month: p.birthDate.month, day: p.birthDate.day}) <= end
        WITH *, {person: p} AS person, date({year: start.year, month: p.birthDate.month, day: p.birthDate.day}) AS eventDate
        RETURN "Birthday" AS eventType,
          eventDate,
          duration.between(p.birthDate, eventDate).years AS anniversary,
          [person] AS people
        UNION
        WITH date($start) AS start, date($end) AS end
        MATCH (p:Person)
        WHERE start <= date({year: start.year, month: p.nameDate.month, day: p.nameDate.day}) <= end
        WITH *, {person: p} AS person, date({year: start.year, month: p.nameDate.month, day: p.nameDate.day}) AS eventDate
        RETURN "Nameday" AS eventType,
          eventDate,
          0 AS anniversary,
          [person] AS people
      }
      RETURN *
      ORDER BY eventDate
      `,
        {
          start: since.format("YYYY-MM-DD"),
          end: until.format("YYYY-MM-DD")
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
