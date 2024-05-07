
import { createMarriage, fetchMarriages } from "@/lib/actions/people";
import { headers } from "next/headers";

export async function GET(
  request: Request,
  { params }: { params: { id: string }
}) {
  return Response.json(await fetchMarriages(params.id));
}

export async function POST(
  request: Request,
  { params }: { params: { id: string }
}) {

console.log("POST");

  const headersList = headers();
  const contentType = headersList.get("Content-type");

console.log(contentType);

  let formData: FormData = new FormData();

  if ("application/json" == contentType) {
    const json = await request.json();
console.log(json);
    for (const key in json) {
      formData.append(key, json[key]);
    }
  } else if ("application/x-www-form-urlencoded" == contentType ||
             "multipart/form-data" == contentType) {
    formData = await request.formData();
console.log(formData);
  }

  const spouse = formData.get("spouse")?.toString();
  if (typeof spouse == "undefined") {
    return Response.json({}, {status: 400, statusText: "Missing spouse id"});
  }

console.log(spouse);

  formData.delete("spouse");
  return Response.json(await createMarriage(params.id, spouse, formData));
}

/*
export async function createChildRel(parent: string, child: string) {
  const rel: RecordShape = createRel(child, parent, "IS_CHILD_OF", {});
  console.log(rel);
  return { id: rel.elementId };
}

export async function createSpouseRel(person: string, spouse: string, formData: FormData) {
  const rel: RecordShape = createRel(person, spouse, "MARRIED_TO", formData ? toMarriageObject(formData) : {});
  console.log(rel);
  return {
    id: rel.elementId,
    beginDate: rel.properties?.beginDate?.toStandardDate(),
    endDate: rel.properties?.endDate?.toStandardDate(),
    endCause: rel.properties?.endCause
  }
}

*/