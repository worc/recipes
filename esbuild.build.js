import * as esbuild from 'esbuild'
import ejs from 'ejs'
import fs from 'fs'
import path from 'path'
import crypto from 'crypto'

// Same shape as reuben.report's build. Output layout, which nginx's cache rules on Altair rely on:
//   dist/index.html            never cached (it's the only file whose name doesn't change)
//   dist/index.<hash>.js       content-hashed
//   dist/public/<name>.<hash>  content-hashed markdown + images, served `immutable`

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
  loader: {
    '.md':   'file',
    '.jpg':  'file',
    '.jpeg': 'file',
    '.png':  'file',
    '.webp': 'file',
  },
  assetNames: 'public/[name].[hash]',
  publicPath: '/',
})

// All output files are in-memory. Write assets (md, images) to their natural paths,
// and write the JS bundle with a content hash in the filename.
for (const file of result.outputFiles) {
  const isJS = file.path.endsWith('.js') && !file.path.endsWith('.js.map')
  const isMap = file.path.endsWith('.js.map')

  if (isJS || isMap) continue

  fs.mkdirSync(path.dirname(file.path), { recursive: true })
  fs.writeFileSync(file.path, file.contents)
}

const jsOutput = result.outputFiles.find(f => f.path.endsWith('.js') && !f.path.endsWith('.js.map'))
const mapOutput = result.outputFiles.find(f => f.path.endsWith('.js.map'))

const hash = crypto
  .createHash('md5')
  .update(jsOutput.contents)
  .digest('hex')
  .slice(0, 8)

const outfile = `index.${hash}.js`
// the map is written under the hashed name, so point the bundle's sourceMappingURL at it
const js = Buffer.from(jsOutput.contents).toString('utf8').replace(/sourceMappingURL=(\/?)index\.js\.map\s*$/, `sourceMappingURL=$1${outfile}.map`)
fs.writeFileSync(`dist/${outfile}`, js)
if (mapOutput) {
  fs.writeFileSync(`dist/${outfile}.map`, mapOutput.contents)
}

ejs.renderFile(
  'src/index.ejs',
  { index: outfile },
  {},
  (err, str) => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
    fs.writeFileSync('dist/index.html', str)
  },
)

console.log('Build complete:', outfile)
