import { type Person } from "@/lib/actions/types";

import {
  deletePerson,
  updatePerson,
  fetchChildren,
  fetchMarriages,
  fetchParents,
  fetchPerson,
  fetchSiblings,
} from "@/lib/actions/people";

import { headers } from "next/headers";

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
    const [marriages, children, parents, siblings] = await Promise.all([
      moreInfo.includes("marriages") ? fetchMarriages(person.id) : [],
      moreInfo.includes("children") ? fetchChildren(person.id) : [],
      moreInfo.includes("parents") ? fetchParents(person.id) : [],
      moreInfo.includes("siblings") ? fetchSiblings(person.id) : []
    ])

    let result: any = {
      ...person
  }

    // Compose result
    if (moreInfo.includes("marriages")) {
      result = {
        ...result,
        marriages: marriages
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
  return Response.json({}, {status: 200, statusText: "Deleted"});
}

// Update only as resourse ids are allocated by the database.
export async function PUT(
  request: Request,
  { params }: { params: { id: string }
}) {

  const headersList = headers();
  const contentType = headersList.get("Content-type");

  let formData: FormData = new FormData();

  if ("application/json" == contentType) {
    const json = await request.json();
    for (const key in json) {
      formData.append(key, json[key]);
    }
  } else if ("application/x-www-form-urlencoded" == contentType ||
             "multipart/form-data" == contentType) {
    formData = await request.formData();
  }

  try {
    await updatePerson(params.id, formData);
  } catch (e: any) {
    return Response.json({}, {status: 404, statusText: e.message});
  }
  return Response.json({}, {status: 200, statusText: "Updated"});
}
