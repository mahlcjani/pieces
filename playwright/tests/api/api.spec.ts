import { expect } from "@playwright/test";
import { apiTest as test } from "./api";

test("api fixture is accessible", async ({ api }) => {
  expect(api.endpoint({})).toEqual("/api/v1");
  expect(api.endpoint({calendar: {}})).toEqual("/api/v1/calendar");
  expect(api.endpoint({people: {person: 1}})).toEqual("/api/v1/people/1");
  expect(api.endpoint({people: {id: 1}})).toEqual("/api/v1/people/1");
  expect(api.endpoint({people: {str: "1"}})).toEqual("/api/v1/people/1");
  expect(api.endpoint({people: {person: "john", marriages: {}}})).toEqual("/api/v1/people/john/marriages");

  expect(api.endpoint({
    people: {
      person: "john",
      marriages: {
        id: 12,
        beginDate: {}
      }
    }
  })).toEqual("/api/v1/people/john/marriages/12/beginDate");


});
