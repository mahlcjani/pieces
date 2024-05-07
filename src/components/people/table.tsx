
import { fetchPeople } from "@/lib/actions/people";
import { List, ListItem, ListItemButton, ListItemContent, Table, Typography } from "@mui/joy";

import dayjs from "@/lib/dayjs";

function formatDate(date: Date | string | undefined) {
  return date ? dayjs(date).format("ll") : "";
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
