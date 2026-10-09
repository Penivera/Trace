import { clientEnv } from "./env.client";

export const siteConfig = {
  name: "TRACE",
  description:
    "A detective game built on real Solana activity. Follow the funds, collect evidence, solve the case.",
  url: clientEnv.NEXT_PUBLIC_SITE_URL,
} as const;
