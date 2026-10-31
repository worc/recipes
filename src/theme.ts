// Palette and type. Technical-but-humanist: drafting-paper hairlines, map-style hatching,
// a ballpoint red for annotations, turquoise as the house color.

export const COLOR = {
  paper: '#fbfbf8',
  ink: '#1c1f22', // 16:1 on paper
  muted: '#5b6168', // 6:1, labels and secondary text
  rule: '#c9ced3', // hairlines
  turquoise: '#68bdd4', // stxalq.dev's background. Fills, bands and hatching only (2:1 on paper, not for text)
  turquoiseInk: '#256f83', // same hue, darkened for link text (5.5:1)
  haze: '#aaccee', // koma-kulshan's #ace. Selection and hover fills
  hazeFaint: '#e9f1f8',
  red: '#810e0e', // ktmap's ballpoint red. Margin notes (10:1)
}

export const FONT = {
  display: '\'Rokkitt\', \'Roboto Slab\', Georgia, serif',
  body: '\'Liberation Sans\', Arial, Helvetica, sans-serif',
  mono: '\'Cascadia Code\', ui-monospace, Menlo, Consolas, monospace',
}

// Thin diagonal lines like the building fills on the ktmap tiles. A repeating pattern, not a gradient ramp.
export function hatch (color: string, gap = 6): string {
  return `repeating-linear-gradient(-45deg, ${color} 0 1px, transparent 1px ${gap}px)`
}

export const WIDE = '(min-width: 900px)'
