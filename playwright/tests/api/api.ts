import { test, APIRequestContext } from "@playwright/test";

export class API {
  readonly root = "/api/v1";
  readonly request: APIRequestContext;

  constructor(request: APIRequestContext) {
    this.request = request;
  };

  /**
   * Abstract path - nested objects. On each level 2 optional properties can exist:
   * - primitive: number, string
   * - object
   *
   * Properties are used to compose endpoint URL in such a way that:
   * - if primitive is defined its value is appended to currently constructed path
   * - if the other property is defined its name is appended and the abstract
   *   path tree is traversed down. Examples:
   * - { slug: "123" }        - "/123"
   * - { sub: {} }            - "/sub"
   * - { slug: 123, sub: {}}  - "/123/sub"
   * - {
   *      pid: "123",
   *      next: {
   *        slug: "abc",
   *        more: {
   *          id: "done"
   *        }
   *      }
   *   }
   *   will result in "/123/next/abc/more/done" appended to current path.
   */
  endpoint(abstractPath: any): string {
    let path = this.root;
    let pointer = abstractPath;
    do {
      let next = undefined;
      let properties = Object.entries(pointer);
      for (const [key, value] of properties) {
        switch (typeof value) {
          case "string":
          case "number":
            path = path.concat(`/${value}`);
            break;
          case "object":
            if (Array.isArray(value)) {
              // this is undocumented ;)
              path = path.concat(`/${value.join("/")}`);
            } else {
              path = path.concat(`/${key}`);
              next = pointer[key];
            }
           break;
        }
        if (next) {
          break;
        }
      }
      pointer = next;
    } while (pointer);

    return path;
  }

  async get(path: any, params?: any): Promise<any> {
    return await this.request.get(this.endpoint(path), { params: params });
  }

  async delete(path: any, params?: any): Promise<any> {
    return await this.request.delete(this.endpoint(path), { params: params });
  }

  async post(path: any, data: any): Promise<any> {
    return await this.request.post(this.endpoint(path), { data: data });
  }

  async put(path: any, data: any): Promise<any> {
    return await this.request.post(this.endpoint(path), { data: data });
  }
}

/**
 * Enhancement for Playwright test class that makes use of API by mechanism of fixtures.
 * Usage:
 *
 * import { apiTest as test } from "<this module>";
 *     (with aliasing no changes to existing tests are required)
 *
 * test(..., async ({ api }) => {
 *   api.get("{calendar:{}}");
 *
 */
export const apiTest = test.extend<{api: API}>({
  api: async ({ request }, use) => {
    await use(new API(request));
  }
});
