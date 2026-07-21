# Upvote — agent notes

A feature-request voting board, forked from the canonical Hanzo app starter.
Vite + React 19 + `@hanzo/gui` (UI) + `@hanzo/iam` (auth) + `@hanzo/base` (data).
Keep it minimal and REAL — every surface must build and run, no fabricated data.

## What it is

Users submit feature requests and upvote existing ones; the product team moves
each request through **open → planned → shipped** and sees vote-sorted demand.
Three views: **Board** (status columns of vote-sorted cards), **Request detail**
(description + status control + comments), **Submit** (new-request form). Router
free — `src/views/board.tsx` holds a small `View` state (board · detail · submit).

## One way, decomplected

- **Providers** (`src/providers.tsx`) mount in the canonical order every Hanzo
  surface ships: `GuiProvider` → `IamProvider` → `BaseProvider`. `BaseProvider`
  gets a `BaseClient` carrying the IAM access token; it is rebuilt when the token
  changes (`src/lib/base.ts` `baseAs`). That single seam makes every
  `useQuery`/`useMutation` org-scoped to the signed-in user. Theme is `light`.
- **Data model + palette are one place** (`src/lib/requests.ts`): `Request` /
  `Vote` / `Comment` types, the `STATUSES` metadata (label + dot color), and the
  `ui` indigo-on-soft-white palette.
- **Board owns writes.** `board.tsx` is the single owner of `requests` + `votes`
  (list, create, vote toggle, status change); `request-detail.tsx` owns the
  `comments` collection for the open request. Voting is a toggle: a `votes` row
  per principal enforces one vote per person and keeps the denormalized
  `requests.votes` counter in lockstep.
- **UI is one system** — `@hanzo/gui` primitives only (no second kit, no
  Tailwind). The upvote pill (`upvote-pill.tsx`) is the one shared vote control.

## Gotchas (do not regress)

- **`@hanzo/gui` under Vite** needs three things in `vite.config.ts` (it is the
  Tamagui line): (1) alias `react-native` → `react-native-web`, (2) `define`
  `process.env.TAMAGUI_TARGET` / `NODE_ENV` / `__DEV__`, (3) `dedupe`
  react/react-dom/react-native-web. No Tamagui compiler, no `one`, no Expo.
- **`@hanzo/gui` props are Tamagui LONGHAND** with this v5 config:
  `alignItems`/`justifyContent`/`backgroundColor`/`padding`/`paddingHorizontal`/
  `borderRadius`/`textAlign` — NOT the `items`/`justify`/`bg`/`p`/`px`/`rounded`/
  `text` shorthands. Shorthands pass at runtime but FAIL `tsc`. `Button` uses
  `onPress`; `Input`/`TextArea` use `value`/`onChangeText`.
- **PKCE storage is `localStorage`** so the verifier/state survive the round-trip
  to hanzo.id. Client id reads `import.meta.env.VITE_IAM_CLIENT_ID` (fallback
  `hanzo-app`); deploy provisions a per-app client.
- **`schema.sql` is the data contract** — the `databaseSchema` DDL the deploy
  turns into Base collections. Keep it in lockstep with `src/views/*`.

## Deploy contract (Hanzo Cloud)

- Static SPA: `npm run build` → `dist/`, served at `<slug>.hanzo.app` from
  object storage. No server process.
- On publish, `schema.sql` → `provisionBaseFromDDL` creates the `requests`,
  `votes`, `comments` collections (org-scoped, IAM-native, rule
  `@request.auth.org_id = org`). Runtime read/write is browser →
  `VITE_HANZO_BASE_URL` with the IAM token.
- **IAM redirect registration** is the one external requirement: the IAM client
  (`VITE_IAM_CLIENT_ID`) must allow this origin’s `/auth/callback`.

## Proven

`tsc --noEmit` clean · `vite build` → `dist/` (899 modules) · renders under Vite.
`login()` performs a real PKCE S256 redirect to hanzo.id.

## Build

CI (`.github/workflows/ci.yml`) runs `npm ci && npm run typecheck && npm run
build` — build-verification only, NEVER a container image (Hanzo Cloud owns
deploys; do not build images locally).
