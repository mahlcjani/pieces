
import { type Person } from "@/lib/data.d";
import { createPerson, fetchPeople } from "@/lib/data";

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
  --request PUT \
  --header "Content-Type: application/json" \
  --data '{"name": "Maciej Misiołek", "birthDate": "1971-11-18"}'

curl \
  --request PUT \
  --header "Content-type: application/x-www-form-urlencoded" (also implied by curl)
  --data 'name=Maciej Misiołek' \
  --data 'birthDate=1971-11-18'

curl \
  --request PUT \
  --header "Content-Type: multipart/form-data" \ (also implied by curl)
  --form 'name=Maciej Misiołek' \
  --form 'birthDate=1971-11-18'

*/
export async function PUT(request: Request) {

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
      return Response.json(await createPerson(sex, formData))
    } catch (e: any) {
      return Response.json({error: e.message}, {status: 400, statusText: "Bad request"});
    }
  }

  return Response.json({}, {status: 400, statusText: "Not Found"});
}