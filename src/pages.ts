// The one place a page gets wired into the site. Each entry is a static import, so
// "where does /frybread come from" is always answerable by following the import.
// Routes, the sidebar, the home index, and the build's prerendered link-preview pages all read this list.
//
// Adding a recipe:   src/recipes/<slug>/<slug>.md, then one recipe(...) line below.
// Adding a notebook: src/notebooks/<slug>/<slug>.md, then one notebook(...) line below.
// Featuring a page on the home page: pass { featured: true }. The home page shows the first three.

import coddle from './recipes/coddle/coddle.md'
import frenchToast from './recipes/french-toast/french-toast.md'
import frybread from './recipes/frybread/frybread.md'
import pieDough from './recipes/pie-dough/pie-dough.md'
import tomKhaGai from './recipes/tom-kha-gai/tom-kha-gai.md'
import yogurtChicken from './recipes/yogurt-chicken/yogurt-chicken.md'

import acornSquash from './notebooks/acorn-squash/acorn-squash.md'
import appleButter from './notebooks/apple-butter/apple-butter.md'
import beerChili from './notebooks/beer-chili/beer-chili.md'
import berryIceCream from './notebooks/berry-ice-cream/berry-ice-cream.md'
import blackBeanSoup from './notebooks/black-bean-soup/black-bean-soup.md'
import caramelizedOnions from './notebooks/caramelized-onions/caramelized-onions.md'
import carnitas from './notebooks/carnitas/carnitas.md'
import injera from './notebooks/injera/injera.md'
import potatoSoup from './notebooks/potato-soup/potato-soup.md'

export type PageKind = 'recipe' | 'notebook'

export interface PageEntry {
  kind: PageKind
  // URL segment, matches the folder name
  slug: string
  // sidebar / index label
  name: string
  // route
  path: string
  // hashed URL of the markdown, from esbuild's file loader
  // (in the build's node bundle, src/prerender.ts, the text loader makes this the file's contents instead)
  markdown: string
  featured: boolean
}

interface Options {
  featured?: boolean
}

const recipe = (slug: string, name: string, markdown: string, { featured = false }: Options = {}): PageEntry =>
  ({ kind: 'recipe', slug, name, markdown, path: `/${slug}`, featured })

// notebooks get their own prefix so recipe URLs (which predate them) never collide
const notebook = (slug: string, name: string, markdown: string, { featured = false }: Options = {}): PageEntry =>
  ({ kind: 'notebook', slug, name, markdown, path: `/notebooks/${slug}`, featured })

export const RECIPES: ReadonlyArray<PageEntry> = [
  recipe('coddle', 'Coddle', coddle),
  recipe('french-toast', 'French Toast', frenchToast),
  recipe('frybread', 'Frybread', frybread, { featured: true }),
  recipe('pie-dough', 'Pie Dough', pieDough),
  recipe('tom-kha-gai', 'Tom Kha Gai', tomKhaGai, { featured: true }),
  recipe('yogurt-chicken', 'Yogurt Chicken', yogurtChicken),
]

export const NOTEBOOKS: ReadonlyArray<PageEntry> = [
  notebook('acorn-squash', 'Acorn Squash', acornSquash),
  notebook('apple-butter', 'Apple Butter', appleButter),
  notebook('beer-chili', 'Beer Chili', beerChili),
  notebook('berry-ice-cream', 'Berry Ice Cream', berryIceCream),
  notebook('black-bean-soup', 'Black Bean Soup', blackBeanSoup),
  notebook('caramelized-onions', 'Caramelized Onions', caramelizedOnions, { featured: true }),
  notebook('carnitas', 'Carnitas', carnitas),
  notebook('injera', 'Injera', injera),
  notebook('potato-soup', 'Potato Soup', potatoSoup),
]

export const PAGES: ReadonlyArray<PageEntry> = [...RECIPES, ...NOTEBOOKS]

export const FEATURED: ReadonlyArray<PageEntry> = PAGES.filter(entry => entry.featured).slice(0, 3)

// 1-based position within its own list, for the "№ 03" in title blocks and the index
export function pageNumber (entry: PageEntry): number {
  const list = entry.kind === 'recipe' ? RECIPES : NOTEBOOKS
  return list.indexOf(entry) + 1
}
