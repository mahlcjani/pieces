
import { fetchChildren } from "@/lib/data";

// GET /api/v1/people/[id]/children
export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchChildren(params.id));
}
