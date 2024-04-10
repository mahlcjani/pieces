import {
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/joy";

import AddPersonForm from "@/components/people/addPerson";

export default async function Page() {
  return (
    <>
      <Breadcrumbs aria-label="breadcrumb">
        <Link href="/">Home</Link>
        <Link href="/people/">People</Link>
        <Typography>Add person...</Typography>
      </Breadcrumbs>
      <AddPersonForm />
    </>
  )
}
