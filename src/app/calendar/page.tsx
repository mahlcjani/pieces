"use client"

import { type Anniversary } from "@/lib/actions/types";
import { fetchEvents } from "@/lib/actions/calendar";

import dayjs from "dayjs";

import {
  EventContentArg,
  EventInput,
  EventSourceFuncArg
} from "@fullcalendar/core"

import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import plLocale from "@fullcalendar/core/locales/pl";

import {
  Badge,
  Breadcrumbs,
  Link,
  Stack,
  Typography
} from "@mui/joy";

import Image from "next/image";

export default function Calendar() {

  async function getEvents({start, end}: EventSourceFuncArg): Promise<EventInput[]> {
    const anniversaries = await fetchEvents(start, end);
    return anniversaries.map(e => {
      return {
        title: e.type + " of " +
          e.people.map((p: any) => p.firstName).join() +
          "(" + e.cardinality + ")",
        start: dayjs(e.date).toDate(),
        extendedProps: {
          data: e
        }
      }
    });
  }

  function eventClassNames({event}: EventContentArg) {
    const e: Anniversary = event.extendedProps?.data;
    return [ "fullcalendar-event", "anniversary-of-" + e.type.toLowerCase() ]
    }

  function badgeColor(e: Anniversary) {
    return e.people.some(p => p.deathDate !== undefined) ? "warning" : "primary";
  }

  function renderEventContent({event}: EventContentArg) {
    const e: Anniversary = event.extendedProps?.data;
    return (
      <Stack direction="row" spacing={1.5}>
        <Badge badgeContent={e.cardinality} color={badgeColor(e)} max={999}>
          <Image alt={e.type} src={"/events/" + e.type.toLocaleLowerCase() + "-24.png"} width={24} height={24}/>
        </Badge>
        <div>{e.people.map(p => p.firstName).join("+")}</div>
      </Stack>
    )
  }

  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">
          Home
        </Link>
        <Typography>Calendar</Typography>
      </Breadcrumbs>

      <FullCalendar
        plugins={[ dayGridPlugin ]}
        stickyHeaderDates={true}
        headerToolbar={{
          left: "title",
          center: "",
          right: "today prevYear,prev,next,nextYear"
        }}
        buttonIcons={{
          prev: "chevron-left",
          next: "chevron-right",
          prevYear: "chevrons-left",
          nextYear: "chevrons-right"
        }}
        initialView="dayGridMonth"
        nowIndicator={true}
        weekends={true}
        weekNumbers={true}
        weekNumberFormat={{ week: "numeric" }}
        dayHeaderFormat={{ weekday: "short" }}
        //dayMaxEvents={true}
        locale={plLocale}
        showNonCurrentDates={false}
        fixedWeekCount={false}
        events={getEvents}
        eventContent={renderEventContent}
        eventClassNames={eventClassNames}
        //eventDisplay="block"
        displayEventTime={false}
        height={650}
        //eventBackgroundColor=""
        //eventBorderColor=""
        //eventTextColor=""
        views={{
          month: {
            dayMaxEvents: 2
          },
          week: {
            dayMaxEvents: true,
            weekNumbers: false
          },
          day: {
            dayMaxEvents: true,
            weekNumbers: false
          }
        }}
      />
    </>
  )
}
