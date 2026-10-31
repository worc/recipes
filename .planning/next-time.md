# next time

## phase 1 landed in the working tree (2026-10-30, evening)

Uncommitted, across four repos:

- **frontmatter**: 2.0.0 published (committed + tagged by Curtis). Tests are on `node:test`, with Node running the TS directly.
- **reuben.report**: `frontmatter-js@^2.0.0`; alias + local `declare module` removed. Built from a scratch copy (the sandbox can't clear its `dist/`), and all 7 routes render in headless Chromium.
- **recipes**: webpack/axios/react-router/per-recipe `index.tsx` are gone. Now `esbuild.{build,dev}.js`, `src/index.tsx` (wouter, hash-link redirect), `src/recipes.ts` (the one list), `src/recipe.tsx` (fetch + frontmatter-js + react-markdown/gfm; frontmatter as a plain `<dl>`, a placeholder until the lab-notes pass), `scripts/deploy.sh`. `docs/` is the Pages redirect. Verified: typecheck + build clean; all 7 recipes, home, 404, hash-link redirect, client nav + back, and the Pages redirect (root, `#/slug`, `/recipes/slug`) in headless Chromium.
- **altair**:
  - `altair.conf` gains the `recipes.stxalq.dev` :80/:443 blocks. The reuben.report :443 block gets the same cache rules: `index.html` no-cache; hashed bundle + `/public/` `max-age=1y, immutable`. HSTS is repeated inside each location, since nginx drops inherited `add_header`s in any location that sets its own (the old `/public/` blocks were silently serving assets without HSTS; `scarlet.dog` still is). Tested on a local nginx 1.24: `nginx -t` passes and the response headers are as intended.
  - `deploy.ts` health-checks reuben.report + recipes.
  - `ddns.ts`: ping via `api-ipv4.porkbun.com` plus a dotted-quad guard; any non-2xx, non-JSON, or `status != SUCCESS` response throws with a readable message; a missing A record throws; an IP change now pings Discord; header typo and strict-mode type errors fixed. Exercised with a mocked fetch (IPv6 answer / unchanged / changed / 503 / no record).
  - `readme.md`: webhook URL line removed. Rotation is still on the human list.
- Small thing worth porting to reuben.report: its build renames the bundle to `index.<hash>.js`, but the sourcemap comment still says `/index.js.map` (404 in devtools). recipes' build rewrites the comment.

Next: the human list (`human-do-this.md` sections 1–3), then phase 2.

## build convergence + recipes.stxalq.dev: plan and phase 0 (2026-10-30)

Decided:

- recipes moves to reuben.report's build shape (esbuild scripts, React 19, wouter, TS strict, `dist/`, `scripts/deploy.sh` → `/var/www/recipes.stxalq.dev`). Separate builds, same shape; not a merged build.
- Path routing replaces `HashRouter`; old `/#/slug` links get redirected client-side to `/slug`.
- **GitHub Pages is retired.** `docs/` becomes a single redirect page to `https://recipes.stxalq.dev/` (carrying the `#/slug` along), so old links and bookmarks still land.
- **Phase 0 is frontmatter-js 2.0** (native ESM + types, no esbuild alias). Code is done in the frontmatter repo, waiting on a human publish; see that repo's `todo.md`. recipes uses `^2.0.0` from the start.
- The coddle photos/videos moved from `src/assets/` to `src/recipes/coddle/process-2023-10-09/` (with a readme). Trimming/compressing for the web is later.

Phases:

0. frontmatter-js 2.0: publish (human), then drop the alias in reuben.report.
1. recipes conversion (single typed recipe list drives routes + nav; drop axios/webpack; `index.html` no-cache, `/public/` immutable), nginx blocks drafted in `altair/altair.conf`, DDNS fixes in `altair/scripts/ddns.ts` (`api-ipv4.porkbun.com`, error handling). Then the human steps in `human-do-this.md`.
2. lab-notes style/layout pass, using the Recipe Book project's reference docs as the model. Open: whether notebooks live here (see `ideation.md`).

## yogurt chicken v1: hand-off (2026-10-29)

Agent left these uncommitted in the working tree:

- `src/recipes/yogurt-chicken/yogurt-chicken.md` (new): v1 as cooked, plus v1 notes and v2 changes in the recipe itself
- `src/recipes/yogurt-chicken/index.tsx` (new)
- `src/App.tsx`: import, nav link, route
- `.planning/`: this entry, the homelab subdomain note in `ideation.md` and `over-the-horizon.md`


## tom kha gai: open questions after the migration (2026-10-06)

The recipe now matches the Claude project copy, which was the newest version: the 2025 commit updated the ingredient list for the fry-first method but left the 2023 steps in place. Things that look off, left as-is pending a decision:

- **Galangal amount**: 2023 had ~100g (half sliced, half mashed); current says "1 tablespoon". A tablespoon of grated galangal is maybe 6–10g, so that's a big drop. Intentional?
- **Galangal added twice**: soup steps 5 and 8 both say "add the remaining galangal". Probably one of them is the side-stock half being strained in at step 13?
- **Fish sauce**: "1 tablespoon (~30ml)", but a tablespoon is ~15ml. 2023 had 60ml. Which is it?
- **Lime juice**: step 15 adds lime juice but the ingredients only list limes as garnish. 2023 had 60ml lime juice.
- **Coconut cream**: 240ml (2023) → 500ml (now). Likely intentional (whole tetrapak), just noting it.
- **Lemongrass**: now goes entirely into the side stock and gets strained out; in 2023 it was cut on the diagonal and stayed in the main pot. Intentional change?
- **Date**: frontmatter says "last update: March 2026", taken from when the doc went into the Claude project. Adjust if wrong.
