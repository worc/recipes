// Shared by esbuild.build.js and esbuild.dev.js: everything about the HTML shells.
//
// src/prerender.ts is bundled for node with the `text` loader for .md, so the build reads the exact
// page list the app routes from (src/pages.ts) and summarizes each page with the same code the app
// uses (src/meta.ts). Those summaries go into every shell as JSON, so the home page can sort by date
// and title blocks know their titles without fetching every markdown file.

import * as esbuild from 'esbuild'
import ejs from 'ejs'

export async function loadPages () {
  const out = await esbuild.build({
    entryPoints: ['src/prerender.ts'],
    bundle: true,
    platform: 'node',
    format: 'esm',
    write: false,
    outfile: 'prerender.mjs', // never written; write: false
    loader: { '.md': 'text' },
    logLevel: 'warning',
  })
  const source = Buffer.from(out.outputFiles[0].contents).toString('base64')
  const mod = await import(`data:text/javascript;base64,${source}`)
  return { ...mod, summaries: mod.PAGES.map(mod.pageSummary) }
}

// JSON inside a <script> tag: escaping `<` keeps a stray "</script>" or "<!--" in some page's
// description from ending the tag early.
function embedJson (value) {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

export function renderShell ({ js, css, meta, summaries }) {
  return ejs.renderFile('src/index.ejs', {
    index: js,
    css,
    url: null,
    type: 'website',
    ...meta,
    summaries: embedJson(summaries),
  })
}
