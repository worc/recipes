// Bundled for node by esbuild.pages.js (never part of the browser bundle), with the `text` loader
// for .md, so in here entry.markdown is the file's contents rather than a URL. Gives the build the
// exact page list the app routes from, plus the same title/description logic as the app.

import fm from 'frontmatter-js'
import { PAGES, type PageEntry } from './pages'
import { SITE, HOME_TITLE, KIND_LABEL, pageTitle, summarize, type PageSummary } from './meta'

export { PAGES, SITE, HOME_TITLE }

export function pageSummary (entry: PageEntry): PageSummary {
  const { frontmatter, body } = fm({ content: entry.markdown })
  return summarize(entry, frontmatter, body)
}

export interface RouteMeta {
  title: string
  description: string
  url: string
  type: 'website' | 'article'
}

export function routeMeta (summary: PageSummary): RouteMeta {
  return {
    title: pageTitle(summary.title),
    description: summary.description ?? `${summary.title}: a ${KIND_LABEL[summary.kind]} from the stxalq.dev recipe book.`,
    url: `${SITE.origin}${summary.path}`,
    type: 'article',
  }
}
