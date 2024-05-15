import { Breadcrumbs, Button, Card, Group, Space, Text, Title } from "@mantine/core";

export default function Home() {
  return (
    <>
      <Breadcrumbs m="md">
        <Text>Home</Text>
      </Breadcrumbs>

      <Title order={1}>Welcome</Title>
      <Text></Text>

      <Card m="md" shadow="lg">
        <Title order={2}>People</Title>
        <Text>People directory.</Text>
        <Group>
          <Button component="a" href="/people" variant="light">Open</Button>
        </Group>
      </Card>
      <Card m="md" shadow="lg">
        <Title order={2}>Calendar</Title>
        <Text>Calendar of events derived from people's directory.</Text>
        <Group>
          <Button component="a" href="/calendar" variant="light">Open</Button>
        </Group>
      </Card>
      <Card m="md" shadow="lg">
        <Title order={2}>Adress Book...</Title>
        <Text>For future considerations.</Text>
      </Card>
    </>
  );
}
