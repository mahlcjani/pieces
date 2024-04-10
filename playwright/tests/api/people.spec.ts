import { test, expect } from "@playwright/test";

test.use({
  locale: "en"
})

test('should find people', async ({ request, browserName }) => {
  console.log(browserName);
  const response = await request.get("/api/v1/people", {
    params: {
      "query": "charles",
      "limit": 10,
      "offset": 0
    }
  });

  expect(response.status()).toBe(200);

  const result = await response.json();

  expect(result).toContainEqual(expect.objectContaining({"name": "Charles III"}));

});
