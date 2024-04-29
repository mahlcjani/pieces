import { expect, test } from "@playwright/test";

const testData = {
  "sex": "Man",
  "name": "John Doe",
  "firstName": "John",
  "surname": "Doe",
  "birthDate": "1970-01-01"
};

test("should add person using json", async ({ request }) => {

  const input = {
    ...testData,
    "name": `${testData.name} ${Date.now()}`
  };

  const john = await test.step("should post json", async () => {
    const response = await request.post("/api/v1/people", { data: input });
    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result).toMatchObject(input);

    return result.id;
  });

  await test.step("should not re-post json", async () => {
    const response = await request.post("/api/v1/people", { data: input });
    expect(response.status()).toBe(400);
  });

  await test.step("should read", async () => {
    const response = await request.get(`/api/v1/people/${john}`);
    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result).toMatchObject(input);
  });

  await test.step("should delete", async () => {
    const response = await request.delete(`/api/v1/people/${john}`);
    expect(response.status()).toBe(200);
  });

  await test.step("should not read", async () => {
    const response = await request.get(`/api/v1/people/${john}`);
    expect(response.status()).toBe(404);
  });
});

test("should add person using form", async ({ request }) => {

  const input = {
    ...testData,
    "name": `${testData.name} ${Date.now()}`
  };

  await test.step("should post form", async () => {
    const response = await request.post("/api/v1/people", {
      form: {
        ...input
      }
    });
    expect(response.status()).toBe(200);

    const result = await response.json();
    expect(result).toMatchObject(input);
  });

  await test.step("should not re-post form", async () => {
    const response = await request.post("/api/v1/people", {
      form: {
        ...input
      }
    });
    expect(response.status()).toBe(400);
  });
});
