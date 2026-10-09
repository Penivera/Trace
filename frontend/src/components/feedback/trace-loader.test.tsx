import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TraceLoader } from "./trace-loader";

describe("TraceLoader", () => {
  it("announces loading politely with the given headline", () => {
    render(<TraceLoader label="Opening the workspace" />);

    const status = screen.getByRole("status");
    expect(status).toHaveAttribute("aria-live", "polite");
    expect(status).toHaveTextContent("Opening the workspace");
    expect(status).toHaveTextContent("Loading…");
  });

  it("keeps the decorative trail and rotating lines away from screen readers", () => {
    render(<TraceLoader />);

    expect(screen.getByText("Treasury").closest("[aria-hidden]")).not.toBeNull();
    expect(screen.getByText("Following the money…").closest("[aria-hidden]")).not.toBeNull();
  });
});
