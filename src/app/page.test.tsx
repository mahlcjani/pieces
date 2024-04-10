import { describe, expect, it, test, vi } from "vitest";
import { render, screen, userEvent } from "@/lib/test-utils";
import Page from "./page";

describe("Home page", () => {

  test("renders open buttons", () => {
    render(<Page />);
    expect(screen.getByRole("button", { name: /open/i })).toBeInTheDocument();
  });

});
