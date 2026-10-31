import type { PageSummary } from './meta'

// Written into every HTML shell by the build (and the dev server) as
// <script id="page-summaries" type="application/json">. See esbuild.pages.js.
function read (): ReadonlyArray<PageSummary> {
  const node = document.getElementById('page-summaries')
  if (node === null || !node.textContent) return []
  try {
    return JSON.parse(node.textContent) as Array<PageSummary>
  } catch {
    return []
  }
}

export const SUMMARIES = read()

const BY_PATH = new Map(SUMMARIES.map(summary => [summary.path, summary]))

export function summaryFor (path: string): PageSummary | undefined {
  return BY_PATH.get(path)
}
