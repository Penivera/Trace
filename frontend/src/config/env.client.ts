import { z } from "zod";

const clientEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.url().default("http://localhost:3000"),
});

// NEXT_PUBLIC_* values are inlined at build time only when referenced literally,
// so each key must be listed by name rather than passing process.env through.
const parsed = clientEnvSchema.safeParse({
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
});

if (!parsed.success) {
  throw new Error(`Invalid public environment variables:\n${z.prettifyError(parsed.error)}`);
}

/** Public environment, safe to read from both server and client code. */
export const clientEnv = parsed.data;
