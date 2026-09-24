---
name: Monorepo frontend/backend quirks
description: Non-obvious setup constraints encountered when extending this pnpm workspace.
---

The generated browser API client requires `dom.iterable` in its TypeScript `lib` settings because Orval emits `Headers.entries()` usage.

**Why:** The generated client can otherwise make code generation appear successful while the workspace library typecheck fails.

**How to apply:** Keep `dom.iterable` enabled for browser-facing generated client packages when regenerating OpenAPI hooks.

Drizzle's `createInsertSchema` can already omit generated identity and default columns, so calling `.omit()` for those fields may throw when the inferred schema does not contain them.

**Why:** Newer drizzle-zod behavior can exclude generated columns before the explicit omit is applied.

**How to apply:** Inspect or typecheck the inferred insert schema before omitting generated/default fields; prefer the direct generated insert schema when those columns are already excluded.