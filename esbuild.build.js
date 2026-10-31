import * as esbuild from 'esbuild'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'
import { loadPages, renderShell } from './esbuild.pages.js'

// Same shape as reuben.report's build. Output layout, which nginx's cache rules on Altair rely on:
//   dist/index.html                  the SPA shell (home), never cached
//   dist/<route>/index.html          prerendered shell per page: same app, page-specific <title> + link-preview tags,
//                                    plus every page's summary as JSON (home page lists, title blocks)
//   dist/index.<hash>.js             content-hashed bundle
//   dist/public/index.<hash>.css     content-hashed styles (fonts' @font-face included)
//   dist/public/<name>.<hash>.<ext>  content-hashed markdown, images, fonts, all served `immutable`

const LOADERS = {
  '.md':    'file',
  '.jpg':   'file',
  '.jpeg':  'file',
  '.png':   'file',
  '.webp':  'file',
  '.woff2': 'file',
  '.woff':  'file',
}

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true })
}
fs.mkdirSync('dist')

const result = await esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  minify: true,
  sourcemap: true,
  metafile: true,
  write: false,
  outdir: 'dist',
  loader: LOADERS,
  assetNames: 'public/[name].[hash]',
  publicPath: '/',
})

const hashOf = contents => crypto.createHash('md5').update(contents).digest('hex').slice(0, 8)
const isBundle = (file, ext) => path.basename(file.path) === `index${ext}`
const isMap = (file, ext) => path.basename(file.path) === `index${ext}.map`

// All output files are in-memory. Write assets (md, images, fonts) to their natural paths;
// the JS and CSS bundles get a content hash in their names below.
for (const file of result.outputFiles) {
  if (['.js', '.css'].some(ext => isBundle(file, ext) || isMap(file, ext))) continue
  fs.mkdirSync(path.dirname(file.path), { recursive: true })
  fs.writeFileSync(file.path, file.contents)
}

// Writes index.<hash><ext> (+ map) under `dir`, pointing the sourcemap comment at the renamed map.
function writeHashedBundle (ext, dir) {
  const bundle = result.outputFiles.find(f => isBundle(f, ext))
  const map = result.outputFiles.find(f => isMap(f, ext))
  if (bundle === undefined) return null

  const name = path.posix.join(dir, `index.${hashOf(bundle.contents)}${ext}`)
  const comment = ext === '.css'
    ? /\/\*# sourceMappingURL=(\/?)index\.css\.map \*\/\s*$/
    : /sourceMappingURL=(\/?)index\.js\.map\s*$/
  const text = Buffer.from(bundle.contents).toString('utf8').replace(comment, match =>
    match.replace(/(\/?)index\.(css|js)\.map/, `/${name}.map`))

  fs.mkdirSync(path.join('dist', dir), { recursive: true })
  fs.writeFileSync(path.join('dist', name), text)
  if (map) fs.writeFileSync(path.join('dist', `${name}.map`), map.contents)
  return name
}

const jsFile = writeHashedBundle('.js', '')
const cssFile = writeHashedBundle('.css', 'public')

// ---------------------------------------------------------------------------
// HTML shells: home (also the SPA fallback) plus one per route, each with its own <title> and
// link-preview tags, all carrying the page summaries. See esbuild.pages.js.
// ---------------------------------------------------------------------------

const pages = await loadPages()

async function writeShell (route, meta) {
  const html = await renderShell({ js: jsFile, css: cssFile, meta, summaries: pages.summaries })
  const dir = path.join('dist', route)
  fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(path.join(dir, 'index.html'), html)
}

await writeShell('/', { title: pages.HOME_TITLE, description: pages.SITE.description, url: `${pages.SITE.origin}/`, type: 'website' })

for (const summary of pages.summaries) {
  await writeShell(summary.path, pages.routeMeta(summary))
}

console.log(`Build complete: ${jsFile}, ${cssFile}, ${pages.summaries.length + 1} route shells`)
