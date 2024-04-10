"use client"

import { type Anniversary } from "@/lib/data.d";
import { fetchEvents } from "@/lib/data";

import {
  EventContentArg,
  EventInput,
  EventSourceFuncArg
} from "@fullcalendar/core"

/*
type EventSourceFuncArg = {
  start: Date;
  end: Date;
  startStr: string;
  endStr: string;
  timeZone: string;
};
type EventSourceFunc = (
    (arg: EventSourceFuncArg, successCallback: (eventInputs: EventInput[]) => void, failureCallback: (error: Error) => void)
     => void
  )
| (
    (arg: EventSourceFuncArg)
     => Promise<EventInput[]>
  );
interface EventContentArg {
    event: EventImpl;
    timeText: string;
    backgroundColor: string;
    borderColor: string;
    textColor: string;
    isDraggable: boolean;
    isStartResizable: boolean;
    isEndResizable: boolean;
    isMirror: boolean;
    isStart: boolean;
    isEnd: boolean;
    isPast: boolean;
    isFuture: boolean;
    isToday: boolean;
    isSelected: boolean;
    isDragging: boolean;
    isResizing: boolean;
    view: ViewApi;
}*/

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

export default function Page() {

  async function getEvents({start, end}: EventSourceFuncArg): Promise<EventInput[]> {
    const anniversaries = await fetchEvents(start, end);
    return anniversaries.map(e => {
      return {
        title: e.type + " of " +
          e.people.map((p: any) => p.firstName).join() +
          "(" + e.cardinality + ")",
        start: e.date,
        //url: "../person/" + "111",
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
    return e.people.some(p => typeof p.deathDate !== "undefined") ? "warning" : "primary";
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
