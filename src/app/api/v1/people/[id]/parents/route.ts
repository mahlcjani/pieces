
import { fetchParents } from "@/lib/data";

export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchParents(params.id));
}
