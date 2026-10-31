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

## adding a recipe to the site

1. `src/recipes/<slug>/<slug>.md`: the recipe
2. `src/recipes.ts`: import the markdown and add one `{ slug, name, markdown }` line. That list drives the routes, the nav, and the home index; nothing else to wire.

## build and deploy

Same shape as reuben.report (esbuild + TS + wouter + React 19), separate build.

- `npm run dev`: esbuild watch + serve on http://localhost:41743, with an `index.html` fallback so deep-link refreshes work like prod.
- `npm run build`: writes `dist/` (gitignored). `index.html` is the only unhashed file; the bundle is `index.<hash>.js` and the markdown lands in `public/<name>.<hash>.md`. nginx on Altair relies on that layout: `index.html` is `no-cache`, everything hashed is `immutable`.
- `npm run typecheck`: `tsc --noEmit`.
- `npm run deploy` (on Altair): build, then rsync `dist/` to `/var/www/recipes.stxalq.dev/`.
- Routes are real paths (`/frybread`). Old `/#/frybread` links are rewritten client-side on load.
- `docs/` is no longer a build output: it's a GitHub Pages redirect page (`index.html` + an identical `404.html`) that sends `worc.github.io/recipes/#/slug` to `recipes.stxalq.dev/slug`.

## agent notes

- In a sandboxed shell that can't delete files, plain `git status` can leave an empty `.git/index.lock` behind that blocks the next git command. Use `git --no-optional-locks status` (and generally avoid commands that write to `.git/` unless committing on purpose).
- Agents don't commit or push unless asked; leave changes in the working tree and note them in `next-time.md`.
