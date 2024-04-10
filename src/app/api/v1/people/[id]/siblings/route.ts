
import { fetchSiblings } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchSiblings(params.id));
}
