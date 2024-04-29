
import { type Marriage } from "@/lib/data.d";

import {
  deleteRel,
  fetchMarriage,
  updateMarriage
} from "@/lib/data";

import { headers } from "next/headers";

/**
 * Fetch marriage
 *
 * @param request
 * @param params
 * @returns
 */
export async function GET(
  request: Request,
  { params }: { params: { id: string, rel: string }
}) {
  try {
    const marriage = await fetchMarriage(params.rel);
    // Make sure record is related to person of [id]
    // so the data are consistent
    if (marriage.wife.id !== params.id && marriage.husband.id !== params.id) {
      return Response.json({}, {status: 400, statusText: "Marriage not accessible!"});
    }
    return Response.json(marriage);
  } catch (e: any) {
    return Response.json({}, {status: 404, statusText: e.message});
  }
}

/**
 * Update marriage
 *
 * @param request
 * @param params - person id and relation id
 * @returns
 */
export async function PUT(
  request: Request,
  { params }: { params: { id: string, rel: string }
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

  console.log(formData);

  return Response.json(await updateMarriage(params.rel, formData));
}

/**
 * Delete marriage
 *
 * @param request
 * @param params
 * @returns
 */
export async function DELETE(
  request: Request,
  { params }: { params: { id: string, rel: string }
}) {
  try {
    /*m: Marriage =*/ deleteRel(params.rel);
  } catch (e: any) {
    return Response.json({}, {status: 500, statusText: "Internal error"});
  }
}

async function fetch(
  { params }: { params: { id: string, rel: string }
}): Promise<Marriage> {
  const marriage = await fetchMarriage(params.rel);
  if (!marriage.spouses.find((s:Marriage) => s.id == params.id)) {
    throw new Error("Marriage not accessible!");
    //return Response.json({}, {status: 403, statusText: "Marriage not accessible!"});
  }
  return marriage;
}