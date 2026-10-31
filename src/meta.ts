// Titles and descriptions, shared by the app (document.title) and the build (prerendered
// <title> + link-preview meta), so a tab and a pasted link always say the same thing.

import type { PageEntry, PageKind } from './pages'

export const SITE = {
  name: 'recipes',
  origin: 'https://recipes.stxalq.dev',
  // from .planning/over-the-horizon.md
  description: 'A personal recipe book that\'s an ongoing conversation with myself: recipes I actually cook, written the way I actually cook them, plus the notebooks behind them.',
}

export const HOME_TITLE = `${SITE.name} · stxalq.dev`
export const NOT_FOUND_TITLE = `not found · ${SITE.name}`

export function pageTitle (title: string): string {
  return `${title} · ${SITE.name}`
}

export const KIND_LABEL: Record<PageEntry['kind'], string> = {
  recipe: 'recipe',
  notebook: 'notebook',
}

// The page title lives in the markdown as its first `# heading`. Pulled out so the title block
// can own it; the rest of the body renders as-is.
export function splitTitle (body: string): { title: string | null, rest: string } {
  const match = body.match(/^\s*#\s+(.+?)\s*#*\s*$/m)
  if (match === null || match.index === undefined) {
    return { title: null, rest: body }
  }
  // only treat it as the title if nothing but whitespace comes before it
  if (body.slice(0, match.index).trim() !== '') {
    return { title: null, rest: body }
  }
  return { title: match[1], rest: body.slice(match.index + match[0].length) }
}

function plain (markdown: string): string {
  return markdown
    .replace(/!\[[^\]]*\]\([^)]*\)/g, '')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/\*\*|__|\*|`|~~/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// First real prose paragraph of the intro (before the first `##` section): skips lists, tables,
// rules, quotes, and the "**Key:** value" metadata lines some notebooks open with. A page with
// no intro prose gets null, and the caller falls back to a generic line.
export function describe (rest: string, maxLength = 200): string | null {
  const firstSection = rest.search(/^##\s/m)
  const intro = firstSection === -1 ? rest : rest.slice(0, firstSection)
  const blocks = intro.split(/\n\s*\n/).map(block => block.trim()).filter(Boolean)
  for (const block of blocks) {
    if (/^(#|\||-{3,}|[-*+] |\d+\. |>|!\[)/.test(block)) continue
    const lines = block.split('\n')
    if (lines.every(line => /^\*\*[^*]+:\*\*/.test(line.trim()))) continue
    const text = plain(block)
    if (text.length < 20) continue
    if (text.length <= maxLength) return text
    const cut = text.slice(0, maxLength)
    return `${cut.slice(0, cut.lastIndexOf(' '))}…`
  }
  return null
}

// Everything the home page and title blocks need about a page without fetching its markdown.
// Computed at build time (src/prerender.ts) and embedded in every HTML shell as JSON.
export interface PageSummary {
  path: string
  kind: PageKind
  name: string
  // the markdown's `# heading`, or the registry name
  title: string
  // first intro paragraph, or null if there isn't one
  description: string | null
  originalDate: string | null
  lastUpdate: string | null
}

function field (frontmatter: Record<string, string | string[]>, key: string): string | null {
  const value = frontmatter[key]
  if (value === undefined) return null
  return Array.isArray(value) ? value.join(', ') : value
}

export function summarize (entry: PageEntry, frontmatter: Record<string, string | string[]>, body: string): PageSummary {
  const { title, rest } = splitTitle(body)
  return {
    path: entry.path,
    kind: entry.kind,
    name: entry.name,
    title: title ?? entry.name,
    description: describe(rest),
    originalDate: field(frontmatter, 'original date'),
    lastUpdate: field(frontmatter, 'last update'),
  }
}
