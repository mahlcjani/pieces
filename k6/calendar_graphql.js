import http from "k6/http";
import { check } from "k6";

export const options = {
  vus: 10,
  duration: "30s",
};

export default function() {
  const response = http.post("http://localhost:3000/api/graphql",
    JSON.stringify({
      query: `{
        calendar(since: "2000-01-01", until: "2000-12-31") {
          date
          type
          cardinality
          people {
            id
            name
            firstName
            surname
            birthDate
          }
        }
      }`
    }),
    {
      "headers": {
        "Content-Type": "application/json"
      }
    }
  );

  check(response, {
    "response status": (r) => r.status === 200,
    // We do expect 74 calendar events, 59 birthdays and 15 marriage anniversaries.
    "events count": (r) => r.json("data.calendar.#") === 74
  });
}
