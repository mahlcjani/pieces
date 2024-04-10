
import { fetchPeople } from "@/lib/data";
import { Link, List, ListItem, ListItemButton, ListItemContent, Table, Typography } from "@mui/joy";

import dayjs from "dayjs";

function formatDate(date: Date | undefined) {
  return date ? dayjs(date).format("YYYY-MM-DD") : "";
}

function formatNameDate(date?: Date) {
  return date ? dayjs(date).format("DD MMMM") : "";
}

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
    <List>
      {people?.map((person) => (
        <ListItem key={person.id}>
          <ListItemButton component="a" href={`/people/${person.id}?query=${query}&page=${currentPage}`}>
            <ListItemContent>
              <Typography level="title-md">{person.name}</Typography>
              <Typography level="body-sm">
                {person.surname}, {person.firstName} <br />
                {formatDate(person.birthDate)} - {formatDate(person.deathDate)}
              </Typography>
            </ListItemContent>
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );
}
