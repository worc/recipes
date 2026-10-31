# ideation

Unprioritized. Strike through or delete when done or abandoned.

## site / tooling

- Nav and routes are hand-maintained in `App.tsx`. Could generate both from `src/recipes/*` via `require.context`, so adding a recipe is one folder and nothing else.
- ~~`MarkdownRecipe` dumps frontmatter as raw `JSON.stringify`.~~ Title block with dated cells (2026-10-31).
- Recipe frontmatter could carry structured fields (anchor ingredient, yield, tags) if a use ever shows up. Don't add them speculatively.
- **Promote the site to a subdomain on the homelab** (decided 2026-10-30: `recipes.stxalq.dev`, and GitHub Pages is retired to a redirect instead of kept as a fallback; see `next-time.md`). Reason: cache-busting on Pages is inconsistent. The build already content-hashes the bundle and the `.md` files (`bundle.[contenthash].js`, file-loader hashes), so the stale part is `index.html` itself: Pages/its CDN cache it for a while with headers we can't set. On the homelab we control that: `index.html` as `no-cache`, hashed assets as long-lived `immutable`. Check deep links (e.g. `/yogurt-chicken`) resolve on a hard refresh on whichever host serves it.
- ~~reuben.report already moved to esbuild + TS + wouter. If this repo gets touched seriously, converging the two build setups might be worth it. Or not.~~ Doing it (2026-10-30), see `next-time.md`.

## recipes waiting to land here

- **The 2011–13 Dropbox archive:** 31 staged in `.planning/old-recipes-and-notes/`, tracked in its `triage.md` (25 recipes, 6 notebooks, plus acorn squash). The six copied recipes stay archive-only; they're blank notebooks on the site now (2026-10-31).

Things that exist elsewhere (conversations, the Claude project, my head) and could become recipes in this repo:

- classic tuna sandwich filling: albacore (water-packed), mayo, dijon, sriracha, green onion, black pepper, smoked paprika, citrus if there's fresh fruit. Needs a measured ratio. Lineage back to grandma's mid-century repertoire, with sandwich spread → mayo and yellow → dijon.
- whiskey sauce chicken thighs
- caramelized onion bulk method (lives as a reference + process log; maybe the method graduates here and the log stays a notebook)
- djaj mqualli, once it's been made
- frybread: the `# non-vegan frybread?` stub at the bottom of the file

## gaps in existing recipes

- coddle, french toast: volumes/counts only, no weights (acorn squash is a blank notebook now)
- coddle: no quantities on most ingredients (expected: they're notes from watching a video)
- pie dough: dough only, no bake/assembly
- tom kha gai: see `next-time.md` for open quantity questions

## lab notebooks vs. recipes

~~Undecided.~~ Decided 2026-10-31: they live in `src/notebooks/`, published at `/notebooks/<slug>`, listed separately as "lab notes". First three pulled from Recipe Book chats: caramelized onions, berry ice cream, apple butter. Still in conversations only, not yet a doc of any kind: the sinh tố bơ ratio model (2:1 / 1:1 / 1:2 avocado to adjunct), the Weber garlic roast. As finished recipes, not notebooks: whiskey sauce chicken thighs. As a reference rather than a notebook: the Maghrebi axes doc.

## site, later

- **A photo per recipe.** Next after the archive is wrangled. Probably a `photo:` frontmatter key (or a `<slug>.jpg` beside the markdown) feeding both the title block and the featured cards; the coddle process photos are the first candidates.
- ~~**Intros for frybread and tom kha gai.**~~ Written from Curtis's notes (2026-10-31).

- **og:image.** Link previews are text-only (`twitter:card summary`). A rendered title-block card per page (build-time, e.g. Playwright screenshot of a card route) would be very on-brand.
- ~~**Dates on the home index.**~~ Done 2026-10-31: page summaries embedded in every shell.
- **Dark mode.** Not attempted; the palette would need a second set of inks.
- **Coddle process photos** (`src/recipes/coddle/process-2023-10-09/`): trim, compress, then reference from `coddle.md`; image styling is already in place.
