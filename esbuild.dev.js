import * as esbuild from 'esbuild'
import fs from 'fs'
import { loadPages, renderShell } from './esbuild.pages.js'

const PORT = 41743 // altair status page is 41741, reuben.report dev is 41742

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true })
}
fs.mkdirSync('dist')

// Dev serves one shell for every route (per-route titles/previews only exist in `npm run build`),
// rewritten after each rebuild so the embedded page summaries track markdown edits.
async function writeDevShell () {
  const pages = await loadPages()
  fs.writeFileSync('dist/index.html', await renderShell({
    js: 'index.js',
    css: 'index.css',
    meta: { title: 'recipes (dev)', description: 'dev build' },
    summaries: pages.summaries,
  }))
}

const shellPlugin = {
  name: 'dev-shell',
  setup (build) {
    build.onEnd(async result => {
      if (result.errors.length === 0) await writeDevShell()
    })
  },
}

const context = await esbuild.context({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  sourcemap: true,
  outdir: 'dist',
  loader: {
    '.md':    'file',
    '.jpg':   'file',
    '.jpeg':  'file',
    '.png':   'file',
    '.webp':  'file',
    '.woff2': 'file',
    '.woff':  'file',
  },
  assetNames: 'public/[name].[hash]',
  publicPath: '/',
  plugins: [shellPlugin],
})

await context.watch()

const { hosts, port } = await context.serve({
  servedir: 'dist',
  port: PORT,
  // same job as nginx's try_files fallback: a refresh on /frybread gets the app, not a 404
  fallback: 'dist/index.html',
})

console.log(`http://${hosts[0]}:${port}`)
