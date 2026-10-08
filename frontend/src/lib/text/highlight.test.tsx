import { render } from "@testing-library/react";
import { expect, it } from "vitest";

import { renderHighlights } from "./highlight";

it("wraps {{marked}} text in highlight spans and keeps the rest as plain text", () => {
  const { container } = render(<p>{renderHighlights("Sent {{20 SOL}} at {{02:43 UTC}}.")}</p>);

  expect(container).toHaveTextContent("Sent 20 SOL at 02:43 UTC.");
  const highlighted = [...container.querySelectorAll("span")].map((s) => s.textContent);
  expect(highlighted).toEqual(["20 SOL", "02:43 UTC"]);
});

it("applies a custom highlight class", () => {
  const { container } = render(<p>{renderHighlights("at {{02:40}}", "font-semibold")}</p>);
  expect(container.querySelector("span")).toHaveClass("font-semibold");
});

it("returns unmarked text unchanged", () => {
  expect(renderHighlights("No one authorized the transfer.")).toEqual([
    "No one authorized the transfer.",
  ]);
});
