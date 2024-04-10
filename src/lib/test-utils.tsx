// Some of the stuff can be done in vitest-setup.js/ts
// that should be included into vitest config and tsconfig

import { cleanup, render } from "@testing-library/react"
import { afterEach, beforeAll, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

beforeAll(() => {
  vi.mock("next/navigation", () => {
    const actual = vi.importActual("next/navigation");
    return {
      ...actual,
      useRouter: vi.fn(() => ({
        push: vi.fn(),
      })),
      useSearchParams: vi.fn(() => ({
        get: vi.fn(),
      })),
      usePathname: vi.fn(),
    };
  });
});

afterEach(() => {
  cleanup()
});

function customRender(ui: React.ReactElement, options = {}) {
  return render(ui, {
    // wrap provider(s) here if needed
    wrapper: ({ children }) => children,
    ...options,
  })
}

export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"

// override render export
//export { customRender as render }
