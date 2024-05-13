
import { AddPersonForm } from "@/components/people/person";
import { Anchor, Breadcrumbs, Text } from "@mantine/core";

export default async function Page() {
  return (
    <>
      <Breadcrumbs m="sm">
        <Anchor href="/">Home</Anchor>
        <Anchor href="/people/">People</Anchor>
        <Text>Add person...</Text>
      </Breadcrumbs>
      <AddPersonForm />
    </>
  )
}
