import { QueryClient } from "@tanstack/react-query";

import { ApiError } from "@/lib/api";

const MAX_RETRIES = 2;

export function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Avoid an immediate client refetch of data the server just rendered.
        staleTime: 60 * 1000,
        // 4xx responses will not succeed on retry; only retry network/5xx failures.
        retry: (failureCount, error) =>
          !(error instanceof ApiError && error.isClientError) && failureCount < MAX_RETRIES,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/** A fresh client per server render; one shared client in the browser. */
export function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  browserQueryClient ??= makeQueryClient();
  return browserQueryClient;
}
