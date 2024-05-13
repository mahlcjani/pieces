
import { fetchPeople } from "@/lib/actions/people";
import { formatDate } from "@/lib/utils";
import { Card, Text } from "@mantine/core";

export default async function PeopleTable({
  query,
  currentPage,
  pageSize
}: {
  query: string;
  currentPage: number;
  pageSize: number;
}) {
  const people = await fetchPeople(query, (currentPage-1) * pageSize, pageSize);
  return (
    <>
      {people?.map((person) => (
        <Card
          key={person.id}
          component="a" href={`/people/${person.id}?query=${query}&page=${currentPage}`}
          padding="sm"
        >
          <Text size="md">{person.name}</Text>
          <Text size="sm">{person.surname}, {person.firstName}</Text>
          <Text size="sm">{formatDate(person.birthDate)} - {formatDate(person.deathDate)}</Text>
        </Card>
      ))}
    </>
  );
}
