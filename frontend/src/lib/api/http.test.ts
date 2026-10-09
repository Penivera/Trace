import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { ApiContractError, ApiError } from "./errors";
import { createHttpClient } from "./http";

const client = createHttpClient("https://api.test/");
const caseSchema = z.object({ id: z.string(), title: z.string() });

function mockFetch(response: Response) {
  const fn = vi.fn<typeof fetch>().mockResolvedValue(response);
  vi.stubGlobal("fetch", fn);
  return fn;
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("createHttpClient", () => {
  it("returns parsed data and builds the URL with query params", async () => {
    const fetchMock = mockFetch(Response.json({ id: "c1", title: "The Missing Treasury" }));

    const data = await client.get("/cases/c1", caseSchema, { query: { page: 2, q: undefined } });

    expect(data).toEqual({ id: "c1", title: "The Missing Treasury" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.test/cases/c1?page=2",
      expect.objectContaining({ method: "GET" }),
    );
  });

  it("serializes JSON bodies", async () => {
    const fetchMock = mockFetch(Response.json({ id: "c1", title: "x" }));

    await client.post("cases", caseSchema, { body: { answer: "wallet-a" } });

    const init = fetchMock.mock.calls[0]?.[1];
    expect(init?.body).toBe('{"answer":"wallet-a"}');
    expect(init?.headers).toMatchObject({ "Content-Type": "application/json" });
  });

  it("throws ApiError with the backend message on non-2xx", async () => {
    mockFetch(Response.json({ message: "Case not found" }, { status: 404 }));

    const error = await client.get("/cases/nope", caseSchema).catch((e: unknown) => e);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({ status: 404, message: "Case not found", isClientError: true });
  });

  it("throws ApiContractError when the response shape is wrong", async () => {
    mockFetch(Response.json({ id: 1 }));

    await expect(client.get("/cases/c1", caseSchema)).rejects.toBeInstanceOf(ApiContractError);
  });
});
