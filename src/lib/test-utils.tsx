// Some of the stuff can be done in vitest-setup.js/ts
// that should be included into vitest config and tsconfig

import { cleanup, render } from "@testing-library/react"
import userEvent from '@testing-library/user-event'
import { afterEach, beforeAll, vi } from "vitest"
import "@testing-library/jest-dom/vitest"

import { createTheme, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';

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
    wrapper: ({ children }) => (
      <MantineProvider theme={createTheme({})}>
        <ModalsProvider>
          {children}
        </ModalsProvider>
      </MantineProvider>
    ),
    ...options,
  })
}

/*
function customRender(ui: React.ReactNode) {
  return render(<>{ui}</>, {
    wrapper: ({ children }: { children: React.ReactNode }) => (
      <MantineProvider theme={createTheme({})}>{children}</MantineProvider>
    ),
  });
}
*/

export function setup(jsx: React.ReactElement) {
  return {
    user: userEvent.setup(),
    ...customRender(jsx),
  }
}

export * from "@testing-library/react"
export { default as userEvent } from "@testing-library/user-event"

// override render export
export { customRender as render }
