
import { type Person } from "@/lib/actions/types";
import { createPerson, fetchPeople } from "@/lib/actions/people";

import { headers } from "next/headers";

// GET /api/v1/people?query=&offset&limit=
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const query: string = searchParams.get("query") || "";
  const offset: number = Number(searchParams.get("offset")) || 0;
  const limit: number = Number(searchParams.get("limit")) || 10;

  const people: Person[] = await fetchPeople(query, offset, limit);
  return Response.json(people);
}

/*
curl \
  --request POST \
  --header "Content-Type: application/json" \
  --data '{"name": "John Doe", "birthDate": "1970-01-01"}'

curl \
  --request POST \
  --header "Content-type: application/x-www-form-urlencoded" (also implied by curl)
  --data 'name=John Doe' \
  --data 'birthDate=1970-01-01'

curl \
  --request POST \
  --header "Content-Type: multipart/form-data" \ (also implied by curl)
  --form 'name=John Doe' \
  --form 'birthDate=1970-01-01'

*/
export async function POST(request: Request) {
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

  const sex: string|undefined = formData.get("sex")?.toString();
  if (sex) {
    formData.delete("sex");
    try {
      const record = await createPerson(sex, formData);
      console.log(record);

      return Response.json(record);
    } catch (e: any) {
      return Response.json({error: e.message}, {status: 400, statusText: "Bad request"});
    }
  }

  return Response.json({}, {status: 400, statusText: "Not Found"});
}