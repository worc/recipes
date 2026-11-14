# burn after reading (2026-11-14)

One-time hand-off from a Claude session on deneb. Apply what's below, then delete this file.

## why this file exists

The desktop bridge on deneb **creates new files but doesn't update existing ones**. `device_commit_files` reported both kinds as "written", but every overwrite of an existing file left its old contents in place (`breakfast-sandwich.md` even had its mtime bumped with the old bytes). New files landed fine. So pending edits are collected here instead of being applied in place.

Also: the chat stayed linked to deneb even after it was opened in the desktop app on Altair, with deneb's app closed and restarted. Unresolved.

## what landed

- `src/recipes/breakfast-sandwich/breakfast-sandwich.md`: new recipe, first draft (weight-first ingredients).
- `src/recipes/breakfast-sandwich/breakfast-sandwich-2026-11-14.jpg`: plated photo, not wired into the page (see images below).
- `src/pages.ts`: patched by hand (Curtis), `recipe('breakfast-sandwich', 'Breakfast Thyme for Two', …)`.

## still to apply

### 1. `breakfast-sandwich.md`: count-first ingredients

Decision: things you count go first by count, weights stay in parentheses for posterity. Muffins measured at ~60g and 3.5" across. Replace everything between `## ingredients` and `## steps` with:

```markdown
## ingredients

Scales by the sandwich: one muffin, one egg, half the cheese and aromatics each.

- 2 sourdough english muffins (~60g and 3.5" across each; store-bought unless you're making a day of it)
- 2 large eggs (~100g)
- ~20–30g unsalted butter, split between the pan, the aromatics, and the muffins (a guess, probably on the high side)
- ~28g pepper jack, sliced thin (maybe an ounce)
- 1 green onion stalk (~10–15g), sliced fine
- a pinch of thyme leaves, two sprigs or so
- chili crisp oil (guajillo)
- hot sauce (a mild habanero/carrot is good here)
- black pepper
- salt

```

### 2. `next-time.md`: entry for the top

```markdown
## breakfast sandwich (2026-11-14)

- New recipe at `/breakfast-sandwich` ("Breakfast Thyme for Two" in `pages.ts`). Curtis's write-up with typos fixed (habanero, english muffin) and steps split into sentences. Counted things lead with the count, weights in parentheses; butter weight is a guess and probably high.
- **Voice:** the intro's "fucks with this" stays, and so does its use as the link-preview description. This is closer to a west coast zine than a cooking magazine.
- **Photo** `breakfast-sandwich-2026-11-14.jpg` (2575×2576, ~660 KB) is in the folder but not on the page. See "images" below.
- Not run: typecheck/build.
```

## images: the gist and the plan

Markdown isn't bundled. esbuild emits each `.md` as a hashed file (`/public/<name>.<hash>.md`) that the app fetches at runtime, so:

1. esbuild only emits images the JS **imports**; an image mentioned only in markdown never reaches `dist/`.
2. A relative `![](photo.jpg)` resolves against the page URL (`/photo.jpg`), which 404s.

Options:

- **(recommended) Import in `pages.ts`, map in `markdown.tsx`.** Each entry gets an optional `images` map, `{ 'breakfast-sandwich-2026-11-14.webp': importedUrl }`; an `img` override in `markdown.tsx` swaps a relative `src` for the hashed URL. Markdown keeps plain relative links (still previews in an editor). Fits "pages.ts is the one place". `prerender.ts` needs no change unless we want an `og:image`.
- **esbuild plugin** that rewrites image refs inside the markdown at build time. More automatic, but changes how markdown loads (runtime fetch and the prerender's text loader both).
- **Unhashed `images/` copied into `dist/`.** The only option that touches Altair: `/public/` is served `immutable`, so unhashed images would need their own nginx block and cache rules.

With either of the first two, Altair needs nothing new: images come out hashed under `/public/` and `npm run deploy` rsyncs them like everything else.

Separately: web-size the photos. Probably by hand at this scale (keep the original out of the build, commit a ~1200px webp beside the markdown) rather than adding `sharp` to every build. Same treatment for the coddle process photos when they get wired in.
