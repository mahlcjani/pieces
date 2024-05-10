import { describe, expect, it, test, vi } from "vitest";
import { render, screen, userEvent } from "@/lib/test-utils";
import Page from "./page";

describe("Home page", () => {

  test("renders open buttons", () => {
    render(<Page />);

    const buttons = screen.getAllByRole("link", { name: /open/i });

    expect(buttons.length).toEqual(2);
    expect(buttons[0].getAttribute("href")).toEqual("/people");
    expect(buttons[1].getAttribute("href")).toEqual("/calendar");
  });
});
