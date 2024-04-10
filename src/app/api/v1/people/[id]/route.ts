import { type Person } from "@/lib/data.d";
import {
  deletePerson,
  fetchChildren,
  fetchParents,
  fetchPerson,
  fetchSiblings,
  fetchSpouses
} from "@/lib/data";

// GET /api/v1/people/[id]
export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  const { searchParams } = new URL(request.url);
  const moreInfo: string[] = (searchParams.get("with") || "").split(",");

  const person: Person|undefined = await fetchPerson(params.id);
  if (person) {
    // Fetch whatever required
    const [spouses, children, parents, siblings] = await Promise.all([
      moreInfo.includes("spouses") ? fetchSpouses(person.id) : [],
      moreInfo.includes("children") ? fetchChildren(person.id) : [],
      moreInfo.includes("parents") ? fetchParents(person.id) : [],
      moreInfo.includes("siblings") ? fetchSiblings(person.id) : []
    ])

    let result: any = {
      ...person
    }

    // Compose result
    if (moreInfo.includes("spouses")) {
      result = {
        ...result,
        spouses: spouses
      }
    }
    if (moreInfo.includes("children")) {
      result = {
        ...result,
        children: children
      }
    }
    if (moreInfo.includes("parents")) {
      result = {
        ...result,
        parents: parents
      }
    }
    if (moreInfo.includes("siblings")) {
      result = {
        ...result,
        siblings: siblings
      }
    }

    return Response.json(result);
  }

  return Response.json({}, {status: 404, statusText: "Not Found"});
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string }
}) {
  try {
    await deletePerson(params.id);
  } catch (e: any) {
    return Response.json({}, {status: 404, statusText: e.message});
  }
  return Response.json({}, {status: 400, statusText: "Deleted"});
}
