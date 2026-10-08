const longDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  // On-chain times are UTC; formatting in the viewer's zone could shift the day.
  timeZone: "UTC",
});

/** `"2026-10-01"` → `"October 1, 2026"` (same output on server and client). */
export function formatLongDate(isoDate: string) {
  return longDate.format(new Date(`${isoDate}T00:00:00Z`));
}
