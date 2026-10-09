import { expect, it } from "vitest";

import { formatLongDate } from "./date";

it("formats ISO dates as long US dates without shifting the day", () => {
  expect(formatLongDate("2026-10-01")).toBe("October 1, 2026");
  expect(formatLongDate("2026-12-31")).toBe("December 31, 2026");
});
