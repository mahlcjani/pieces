import { expect } from "@playwright/test";
import { API, apiTest } from "./api";

/**
 * Test steps
 */
export class Steps {
  readonly api: API;

  constructor(api: API) {
    this.api = api;
  };

  async calendar(title: string, {since, until}: {since: Date|string, until: Date|string}): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({calendar:{}}, {
        "since": typeof since === "object" ? since.toJSON().substring(0,10) : since,
        "until": typeof until === "object" ? until.toJSON().substring(0,10) : until
      });
      expect(response.status()).toBe(200);
      return await response.json();
    });
  }

  async find(title: string, {query, limit, offset = 0}: {query: string; limit: number; offset?: number;}): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people:{}}, {
        "query": query,
        "limit": limit,
        "offset": offset
      });
      expect(response.status()).toBe(200);
      return await response.json();
    });
  }

  async addPerson(title: string, character: any, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.post({people:{}}, character);
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async readPerson(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id}});
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async readPersonEx(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id}}, {
        with: "marriages,children,parents,siblings"
      });
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async deletePerson(title: string, id: string, expectedStatus = 200) {
    await test.step(title, async () => {
      const response = await this.api.delete({people: {person: id}});
      expect(response.status()).toBe(expectedStatus);
    });
  }

  async readMarriages(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id, marriages: {}}});
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async linkSpouses(title: string, id: string, spouse: string, expectedStatus = 200) {
    await test.step(title, async () => {
      const response = await this.api.post({people: {person: id, marriages: {}}}, {"spouse": spouse});
      expect(response.status()).toBe(expectedStatus);
    });
  }

  async readChildren(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id, children: {}}});
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async linkParentChild(title: string, id: string, child: string, expectedStatus = 200) {
    await test.step(title, async () => {
      const response = await this.api.post({people: {person: id, children: {}}}, {"child": child});
      expect(response.status()).toBe(expectedStatus);
    });
  }

  async readParents(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id, parents: {}}});
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }

  async readSiblings(title: string, id: string, expectedStatus = 200): Promise<any> {
    return await test.step(title, async () => {
      const response = await this.api.get({people: {person: id, siblings: {}}});
      expect(response.status()).toBe(expectedStatus);
      return await response.json();
    });
  }
}

export const test = apiTest.extend<{steps: Steps}>({
  steps: async ({ api }, use) => {
    await use(new Steps(api));
  }
});
