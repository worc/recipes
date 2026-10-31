# next time

## copied recipes → blank notebooks (2026-10-31, evening)

- **Decision (Curtis):** the six archive recipes copied from someone else stay in `old-recipes-and-notes/` as reference and aren't republished. Each gets a blank notebook instead: acorn squash, beer chili, black bean soup, carnitas (from `street-tacos`), injera, potato soup. Sources found by searching distinctive method lines; they're in each notebook's `## reference` section and in `triage.md`.
- **Acorn squash came off the site.** The 2023 recipe moved back to `old-recipes-and-notes/acorn-squash.md`. `/acorn-squash` redirects client-side to `/notebooks/acorn-squash` (`MOVED` map in `src/index.tsx`). The server still serves the SPA shell for it, so old links land correctly, just without a prerendered preview.
- **Coddle:** intro line saying it's process notes taken while watching Chef John's video, which also gives it a link-preview description.
- **Not decided:** `old-recipes-and-notes/` is untracked right now. If the repo is public, committing it publishes the copies there too; a `.gitignore` line, or keeping the copies out of git, would avoid that.
- Verified: typecheck, build (16 route shells), summaries show the blank notebooks with no `last update`, so they stay off the home page's date lists.

## archive triage + home page (2026-10-31, afternoon)

- **Archive:** `original text files/` is 102 files but only 32 distinct names; 29 are byte-identical across 2011/12/13. The real revisions are fry bread (3), lime cod (2), and pancake batter (2). The other 22 are staged beside Curtis's first nine, same format and dating rule (UTC-8 day of the oldest file timestamp, which reproduces all nine of his dates). Acorn squash is skipped, already live and identical. Everything is in `old-recipes-and-notes/triage.md`, including the copied-recipe question and a proposed structure-only pass. Nothing deleted, nothing published.
- **Home page:** three featured cards (`{ featured: true }` in `src/pages.ts`: frybread, tom kha gai, caramelized onions, placeholders until Curtis picks), then "recently updated" and "longest untouched" (5 each, by `last update`). The full index shows only on narrow screens, since the sidebar covers wide ones. Data comes from page summaries the build embeds in every shell (`esbuild.pages.js`); dev regenerates them on every rebuild (checked: a date edit showed up within seconds).
- **Renames:** the kind label "lab notebook" → "notebook", and the group "lab notes" → "notebooks", since notebooks now also hold kitchen aids.
- Verified: typecheck, build, home at 1280 / 390 with no console errors; the date parser against every real frontmatter date plus edge cases.

## style pass, titles/previews, lab notebooks (2026-10-31)

Uncommitted in the working tree:

- **Notebooks:** `src/notebooks/{caramelized-onions,berry-ice-cream,apple-butter}/`, reconstructed from their Recipe Book chats at their final state (onions: the post–batch 02 restructure; ice cream: the 6/25 rewrite; apple butter: initial write + all seven edits replayed). Text verbatim apart from decoding HTML entities. One fill-in: apple butter's `Final weight / volume: ___` was never updated in the chat; filled from its own results entry (½ pint).
- **Site:** `src/pages.ts` replaces `src/recipes.ts` (recipes + notebooks); `src/page.tsx` replaces `src/recipe.tsx`; new `theme.ts`, `markdown.tsx`, `title_block.tsx`, `layout.tsx`, `home.tsx`, `meta.ts`, `prerender.ts`, `document_title.ts`. Fonts via `@fontsource/rokkitt` + `@fontsource/cascadia-code`.
- **Titles + previews:** `document.title` follows the route; the build prerenders `dist/<route>/index.html` with `<title>`, description, `og:*`, canonical.
- **Verified** (container nginx with the new recipes block, headless Chromium): every route loads without console errors and with the right title, at 1280 and 390 wide; `/frybread/` and `/#/tom-kha-gai` land on clean paths; HTML `no-cache`, hashed assets `immutable`; no horizontal page scroll on a phone.
- **Deploy order matters:** the recipes `location /` in `altair/altair.conf` changed (`$uri/index.html`, no-cache on all shells). With the *old* block, the prerendered folders make nginx 301 `/frybread` → `/frybread/` (the app copes, but the 301 is permanent in browsers' caches). Deploy altair first, then `npm run deploy` here. See `human-do-this.md` §4.

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
