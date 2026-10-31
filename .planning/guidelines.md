# guidelines

Standing conventions for this repo. Change them whenever they stop being true.

## source of truth

- Finished recipes live here, in `src/recipes/<slug>/<slug>.md`. Git history is the revision log.
- The Claude "Recipe Book" project is for research, variation-hunting, and conversation. When a recipe graduates out of conversation it lands here, and the project copy (if any) becomes a pointer back to this repo.
- Git history is worth reading before changing a recipe. Earlier methods are often still useful (e.g. tom kha gai's 2023 boiled-aromatics method vs. the later fry-first method).

## writing a recipe

Recipes are an ongoing conversation with myself. Casual voice is fine, lowercase is fine, "iirc" is fine. They should still capture the tricks and preferences built up over the years.

- **Weight first.** Grams are the primary measure; volumes and counts are welcome as secondary context, e.g. `2 shallots (40g)` or `about 1.5 pounds (700g)`.
- **Ratios over fixed quantities** where the dish allows it. Anchor to one ingredient for scaling (frybread anchors to 100g flour).
- **Ranges and error directions over false precision.** "5 to 10 chiles" and "you'll know it when you see it" are legitimate instructions. When a measurement is uncertain, say which way it's likely off.
- **Sensory cues alongside times.** Times are observations, not commands (count-up timer philosophy: record what the food actually took). Pair them with what done looks/smells/feels like.
- **Process notes and failure modes are first-class.** What went wrong, what was tried, why a step exists. A recipe with no failure modes reads like a recipe blog.
- **Tasting notes** get a place in the recipe when they inform future batches (e.g. "the fish sauce is back-loaded on purpose, adjust at the end").
- **Alternatives inline** in parentheses: `mikrut lime leaves (alternative: thai basil)`.
- Fix obvious typos freely. Don't silently change quantities or method; raise discrepancies as questions in `next-time.md`.

### file shape

```markdown
---

original date: October 2023
last update: March 2026

---

# dish name

## cookware
## ingredients
## steps
```

Sub-sections under ingredients/steps are fine when a dish has components (e.g. a side stock and the main pot). The frontmatter keys are free-form, but `original date` and `last update` are the convention.

## when an agent researches a recipe

- Go broad on variations first. Partly for the love of the game, partly to find the load-bearing ingredients and techniques that every version shares.
- Report what varies and what doesn't, with sources. Then propose, don't overwrite.
- Food science reasoning is welcome (mechanisms, compound names, why a step works), but actionable output comes first when time is short.

## adding a page to the site

- **Recipe:** `src/recipes/<slug>/<slug>.md`, then one `recipe('<slug>', 'Name', import)` line in `src/pages.ts`. Served at `/<slug>`.
- **Notebook:** `src/notebooks/<slug>/<slug>.md`, then one `notebook(...)` line. Served at `/notebooks/<slug>`. Notebook is the catch-all for everything that isn't a recipe: lab notebooks, kitchen aids (conversions, substitutions), technique templates, experiments in progress.
- **Blank notebook:** for a dish where all we have is someone else's recipe. Frontmatter is just `original date` until the first batch is logged (no `last update`, so it stays off the home page's date lists). A `## reference` section names the source with a link and summarizes, in our own words, what that version leans on; never paste its method.
- **Moving or removing a page:** add the old path to the `MOVED` map in `src/index.tsx` so old links still land somewhere.
- **Featured:** add `{ featured: true }` to an entry; the home page shows the first three flagged, in list order.

`src/pages.ts` drives the routes, the sidebar, the home page, and the build's prerendered pages; nothing else to wire. The home page's "recently updated" / "longest untouched" lists sort on the `last update` frontmatter, which is free text at whatever precision is known (`25 October 2012`, `October 2023`, `2023` all work; see `src/dates.ts`). Pages whose date doesn't parse just stay off those lists. The page title is the markdown's first `# heading` (it moves into the title block), the frontmatter fills the title block's cells, and the link-preview description is the first intro paragraph before the first `##` (pages with no intro get a generic line).

## build and deploy

Same shape as reuben.report (esbuild + TS + wouter + React 19), separate build.

- `npm run dev`: esbuild watch + serve on http://localhost:41743, with an `index.html` fallback so deep-link refreshes work like prod. Dev serves one generic shell, regenerated after every rebuild; per-route titles/previews only exist in `npm run build`.
- Every HTML shell (dev and build) embeds each page's summary (title, intro description, dates) as JSON in `<script id="page-summaries">`, produced by `esbuild.pages.js` from `src/prerender.ts`. That's how the home page sorts by date and title blocks know their title before the markdown arrives.
- `npm run build`: writes `dist/` (gitignored): `index.<hash>.js`, `public/index.<hash>.css`, fonts and markdown as `public/<name>.<hash>.<ext>`, plus one prerendered HTML file per route (`dist/<route>/index.html`, same app, page-specific `<title>` and `og:` tags; `src/prerender.ts`). nginx on Altair relies on that layout: every HTML file is `no-cache`, everything hashed is `immutable`, and `try_files $uri $uri/index.html /index.html` (no `$uri/`, which would 301 `/frybread` to `/frybread/`).
- `npm run typecheck`: `tsc --noEmit`.
- `npm run deploy` (on Altair): build, then rsync `dist/` to `/var/www/recipes.stxalq.dev/`.
- Routes are real paths (`/frybread`). Old `/#/frybread` links are rewritten client-side on load.
- `docs/` is no longer a build output: it's a GitHub Pages redirect page (`index.html` + an identical `404.html`) that sends `worc.github.io/recipes/#/slug` to `recipes.stxalq.dev/slug`.

## agent notes

- In a sandboxed shell that can't delete files, plain `git status` can leave an empty `.git/index.lock` behind that blocks the next git command. Use `git --no-optional-locks status` (and generally avoid commands that write to `.git/` unless committing on purpose).
- Agents don't commit or push unless asked; leave changes in the working tree and note them in `next-time.md`.

## look and feel

Technical-but-humanist: drafting-paper hairlines and title blocks, map-style hatching, no gradients or shadows. Tokens live in `src/theme.ts`.

- Color: turquoise `#68bdd4` (stxalq.dev) for fills, bands, and hatching only (it's 2:1 on paper); links use the same hue darkened to `#256f83`. `#ace` haze for hover/selection. Ballpoint red `#810e0e` (ktmap) for margin notes: a markdown `>` blockquote renders as one.
- Type: Rokkitt for titles and section heads, Liberation Sans (Arial fallback) for reading, Cascadia Code for labels, dates, and the leading quantity on list items (`600g chicken thighs` sets the `600g` in mono). Fonts are self-hosted via @fontsource, hashed into `/public/`.
- Markdown conventions that render specially: `---` is a hatched section band; a table row with every cell empty renders as a dashed fill-in line (pre-seeded log rows); a table with an empty header row (`| | |`) drops the header.
