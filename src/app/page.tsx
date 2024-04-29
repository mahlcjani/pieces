import {
  Card,
  CardActions,
  CardContent,
  Button
} from "@mui/joy";

export default function Home() {
  return (
    <>
      <Card variant="outlined">
        <CardContent>
          <h1>People</h1>
          <p>People directory.</p>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="neutral" component="a" href="/people">
            Open
          </Button>
        </CardActions>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <h1>Calendar</h1>
          <p>Callendar of life-time events.</p>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="neutral" component="a" href="/calendar">
            Open
          </Button>
        </CardActions>
      </Card>
      <Card variant="outlined">
        <CardContent>
          <h1>Address Book</h1>
          <p>People address, phones, etc..</p>
        </CardContent>
        <CardActions>
          <Button variant="outlined" color="neutral">
            Open (not working)
          </Button>
        </CardActions>
      </Card>
    </>
  );
}
