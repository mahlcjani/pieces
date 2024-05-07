
import { fetchEvents } from "@/lib/actions/calendar";
import dayjs from "dayjs";

// GET /api/v1/calendar?
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  let since = dayjs(searchParams.get("since"));
  let until = dayjs(searchParams.get("until"));

  // TODO: validate parameters
  // - do not allow for too wide date range
  // - make sensible defaults (if only since or until specified)

  return Response.json(await fetchEvents(since.toDate(), until.toDate()));
}
