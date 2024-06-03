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
        calendar(since: "2000-01-01", until: "2001-01-01") {
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
    "response is 200": (r) => r.status === 200,
    "there are 80 events": (r) => r.json("#") === 80
  });
}
