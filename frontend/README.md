# TRACE — Frontend

Next.js app for TRACE, a detective game built on real Solana activity.

## Stack

| Concern         | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Cache Components), React 19      |
| Language        | TypeScript (strict, `noUncheckedIndexedAccess`)          |
| Styling         | Tailwind CSS v4, design tokens in `src/app/globals.css`  |
| Server state    | TanStack Query (client), `serverApi` (Server Components) |
| Validation      | Zod (env vars and every API response)                    |
| Testing         | Vitest + React Testing Library                           |
| Quality         | ESLint, Prettier, Husky + lint-staged, GitHub Actions CI |
| Package manager | pnpm                                                     |

## Getting started

```bash
cp .env.example .env.local   # then edit values
pnpm install
pnpm dev                     # http://localhost:3000
```

| Script           | What it does                                    |
| ---------------- | ----------------------------------------------- |
| `pnpm dev`       | Dev server (Turbopack)                          |
| `pnpm build`     | Production build                                |
| `pnpm typecheck` | Generates route types, then runs `tsc`          |
| `pnpm lint`      | ESLint                                          |
| `pnpm format`    | Prettier (also sorts Tailwind classes)          |
| `pnpm test`      | Vitest, single run (`pnpm test:watch` to watch) |
| `pnpm check`     | Everything CI runs except the build             |

## Project structure

```text
src/
├── app/                 Routes only: pages, layouts, error/loading boundaries
│   ├── layout.tsx       Root layout: fonts, metadata, <Providers>
│   └── providers.tsx    Client-side providers (TanStack Query)
├── features/            One folder per game domain (cases, investigation, evidence, scoring…)
│   └── <feature>/
│       ├── api/         Zod schemas + fetch functions + query options for this feature
│       ├── components/  UI used only by this feature
│       ├── hooks/
│       └── types.ts
├── components/
│   ├── ui/              Design-system primitives (Button, Card…), no business logic
│   └── layout/          App chrome (header, footer, nav)
├── lib/                 Framework-agnostic building blocks
│   ├── api/             HTTP client, error types
│   ├── query/           QueryClient factory
│   ├── solana/          Address/amount formatting and other chain helpers
│   └── utils/           `cn()` and other tiny helpers
├── config/              Validated env vars and site constants
└── test/                Test setup
```

**Rules of thumb**

- `app/` stays thin. A page fetches data and composes feature components.
- A feature may import from `components/`, `lib/` and `config/`, but **not from another feature**. Shared code moves down into `lib/` or `components/`.
- Tests live next to the code they test (`format.ts` → `format.test.ts`).

## Talking to the backend

```text
Client Component ──► /api/*  ──(next.config.ts rewrite)──► API_BASE_URL
Server Component ──► serverApi ─────────────────────────► API_BASE_URL
```

- **Client Components** import `api` from `@/lib/api/browser`. Requests go to the same origin, so the backend needs no CORS configuration.
- **Server code** imports `serverApi` from `@/lib/api/server`. It is marked `server-only`, so importing it from a Client Component fails the build.
- Every call passes a Zod schema: `api.get("/cases/1", caseSchema)`. A response that does not match throws `ApiContractError`, and a non-2xx response throws `ApiError`.

When an endpoint lands, define it in its feature:

```ts
// src/features/cases/api/cases.ts
export const caseSchema = z.object({ id: z.string(), title: z.string() });

export const caseQueries = {
  detail: (id: string) =>
    queryOptions({ queryKey: ["cases", id], queryFn: () => api.get(`/cases/${id}`, caseSchema) }),
};
```

## Environment variables

See [`.env.example`](.env.example). Variables are validated at startup in `src/config/`:

- `env.server.ts`: secrets and server-only values. Never prefix these with `NEXT_PUBLIC_`.
- `env.client.ts`: `NEXT_PUBLIC_*` values, which are **inlined into the JS bundle at build time**.

`API_BASE_URL` is also read at **build time** by the `/api` rewrite, so set it in the build environment as well as at runtime.
