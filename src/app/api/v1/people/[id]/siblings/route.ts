
import { fetchSiblings } from "@/lib/actions/people";

export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchSiblings(params.id));
}
