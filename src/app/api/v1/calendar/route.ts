
import { fetchEvents } from "@/lib/data";
import dayjs from "dayjs";

// GET /api/v1/calendar?
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const since: Date = new Date(
    searchParams.get("since") || dayjs().subtract(1, "month").format("YYYY-MM-DD")
  );
  const until: Date = new Date(
    searchParams.get("until") || dayjs().format("YYYY-MM-DD")
  );

  return Response.json(await fetchEvents(since, until));
}
