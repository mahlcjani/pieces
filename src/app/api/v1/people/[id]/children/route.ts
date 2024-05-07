
import { createParentage, fetchChildren } from "@/lib/actions/people";
import { headers } from "next/headers";

// GET /api/v1/people/[id]/children
export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchChildren(params.id));
}

export async function POST(
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

  const child = formData.get("child")?.toString();
  if (typeof child == "undefined") {
    return Response.json({}, {status: 400, statusText: "Missing child id"});
  }

  return Response.json(await createParentage(params.id, child));
}
