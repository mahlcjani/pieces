import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function() {
  const response = http.get("http://localhost:3000/api/v1/calendar?since=2000-01-01&until=2000-12-31");

  check(response, {
    "response status": (r) => r.status === 200,
    // We do expect 74 calendar events, 59 birthdays and 15 marriage anniversaries.
    "events count": (r) => r.json("#") === 74
  });
}
