# ideation

Unprioritized. Strike through or delete when done or abandoned.

## site / tooling

- Nav and routes are hand-maintained in `App.tsx`. Could generate both from `src/recipes/*` via `require.context`, so adding a recipe is one folder and nothing else.
- `MarkdownRecipe` dumps frontmatter as raw `JSON.stringify`. A small dates header (original / last update) would read better.
- Recipe frontmatter could carry structured fields (anchor ingredient, yield, tags) if a use ever shows up. Don't add them speculatively.
- **Promote the site to a subdomain on the homelab** (decided 2026-10-30: `recipes.stxalq.dev`, and GitHub Pages is retired to a redirect instead of kept as a fallback; see `next-time.md`). Reason: cache-busting on Pages is inconsistent. The build already content-hashes the bundle and the `.md` files (`bundle.[contenthash].js`, file-loader hashes), so the stale part is `index.html` itself: Pages/its CDN cache it for a while with headers we can't set. On the homelab we control that: `index.html` as `no-cache`, hashed assets as long-lived `immutable`. Check deep links (e.g. `/yogurt-chicken`) resolve on a hard refresh on whichever host serves it.
- ~~reuben.report already moved to esbuild + TS + wouter. If this repo gets touched seriously, converging the two build setups might be worth it. Or not.~~ Doing it (2026-10-30), see `next-time.md`.

## recipes waiting to land here

Things that exist elsewhere (conversations, the Claude project, my head) and could become recipes in this repo:

- classic tuna sandwich filling: albacore (water-packed), mayo, dijon, sriracha, green onion, black pepper, smoked paprika, citrus if there's fresh fruit. Needs a measured ratio. Lineage back to grandma's mid-century repertoire, with sandwich spread → mayo and yellow → dijon.
- whiskey sauce chicken thighs
- caramelized onion bulk method (lives as a reference + process log; maybe the method graduates here and the log stays a notebook)
- djaj mqualli, once it's been made
- frybread: the `# non-vegan frybread?` stub at the bottom of the file

## gaps in existing recipes

- acorn squash, coddle, french toast: volumes/counts only, no weights
- coddle: no quantities on most ingredients
- pie dough: dough only, no bake/assembly
- tom kha gai: see `next-time.md` for open quantity questions

## lab notebooks vs. recipes

The experiment references (onions, ice cream) are a different genre from recipes: newest-first logs, pre-seeded observation rows. Could live in `notebooks/` in this repo (unpublished, or published separately), or stay in the Claude project. Undecided.
