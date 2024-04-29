import { expect } from "@playwright/test";
import { test } from "../steps";

// These tests depend on Kennedy family being loaded into Neo4j

test("should find Josephs", async ({ steps }) => {
  const result = await steps.find("query 'joseph'", {
    query: "joseph",
    limit: 10,
    offset: 0
  });

  expect(result, "search result inlcudes Joseph Patrick Kennedy Sr. and Jr").toEqual(
    expect.arrayContaining([
      expect.objectContaining({"name": "Joseph Patrick Kennedy Sr."}),
      expect.objectContaining({"name": "Joseph Patrick Kennedy Jr."})
    ])
  );
});

test("should find Burkes'", async ({ steps }) => {
  const result = await steps.find("query 'burke'", {
    query: "burke",
    limit: 10,
    offset: 0
  });

  expect(result, "search result inlcudes Burke family").toEqual(
    expect.arrayContaining([
      expect.objectContaining({"name": "Margaret Louise Burke"}),
      expect.objectContaining({"name": "Charles Joseph Burke"}),
      expect.objectContaining({"name": "Margaret Louise DeVine", "birthName": "Burke"}),
      expect.objectContaining({"name": "Charles Joseph Burke Jr"}),
      expect.objectContaining({"name": "Thomas Francis Burke"}),
    ])
  );
});

