import "server-only";

import { serverEnv } from "@/config/env.server";

import { createHttpClient } from "./http";

/**
 * API client for Server Components, Server Actions and Route Handlers.
 * Talks to the backend directly; a relative /api URL would not resolve on the server.
 */
export const serverApi = createHttpClient(serverEnv.API_BASE_URL);
