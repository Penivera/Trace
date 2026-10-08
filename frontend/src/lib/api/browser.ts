import { createHttpClient } from "./http";

/**
 * API client for Client Components. Calls go to same-origin /api/*, which
 * next.config.ts rewrites to the backend.
 */
export const api = createHttpClient("/api");
