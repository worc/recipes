// The one place a recipe gets wired into the site. Each entry is a static import, so
// "where does /frybread come from" is always answerable by following the import.
// Adding a recipe: `recipes/<slug>/<slug>.md`, then one line here.

import acornSquash from './recipes/acorn-squash/acorn-squash.md'
import coddle from './recipes/coddle/coddle.md'
import frenchToast from './recipes/french-toast/french-toast.md'
import frybread from './recipes/frybread/frybread.md'
import pieDough from './recipes/pie-dough/pie-dough.md'
import tomKhaGai from './recipes/tom-kha-gai/tom-kha-gai.md'
import yogurtChicken from './recipes/yogurt-chicken/yogurt-chicken.md'

export interface RecipeEntry {
  // URL path segment, matches the folder name
  slug: string
  // nav / index label
  name: string
  // hashed URL of the markdown, from esbuild's file loader
  markdown: string
}

export const RECIPES: ReadonlyArray<RecipeEntry> = [
  { slug: 'acorn-squash', name: 'Acorn Squash', markdown: acornSquash },
  { slug: 'coddle', name: 'Coddle', markdown: coddle },
  { slug: 'french-toast', name: 'French Toast', markdown: frenchToast },
  { slug: 'frybread', name: 'Frybread', markdown: frybread },
  { slug: 'pie-dough', name: 'Pie Dough', markdown: pieDough },
  { slug: 'tom-kha-gai', name: 'Tom Kha Gai', markdown: tomKhaGai },
  { slug: 'yogurt-chicken', name: 'Yogurt Chicken', markdown: yogurtChicken },
]
