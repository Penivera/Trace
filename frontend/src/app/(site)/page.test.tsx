import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";

import HomePage from "./page";

it("renders the hero headline and primary call to action", () => {
  render(<HomePage />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
    /be the investigator\.\s*trace the story\.\s*solve the case\./i,
  );
  expect(screen.getByRole("link", { name: /play your first case/i })).toHaveAttribute(
    "href",
    "/cases",
  );
});
