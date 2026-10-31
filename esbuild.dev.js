import * as esbuild from 'esbuild'
import ejs from 'ejs'
import fs from 'fs'

const OUTFILE = 'index.js'
const PORT = 41743 // altair status page is 41741, reuben.report dev is 41742

if (fs.existsSync('dist')) {
  fs.rmSync('dist', { recursive: true })
}
fs.mkdirSync('dist')

ejs.renderFile(
  'src/index.ejs',
  { index: OUTFILE },
  {},
  (err, str) => {
    if (err) {
      console.error(err)
    }
    fs.writeFileSync('dist/index.html', str)
  },
)

const context = await esbuild.context({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  sourcemap: true,
  outfile: `dist/${OUTFILE}`,
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

await context.watch()

const { hosts, port } = await context.serve({
  servedir: 'dist',
  port: PORT,
  // same job as nginx's `try_files ... /index.html`: a refresh on /frybread gets the app, not a 404
  fallback: 'dist/index.html',
})

console.log(`http://${hosts[0]}:${port}`)
