// Frontmatter dates are free text, at whatever precision was known: "25 October 2012",
// "October 2023", "2023", "2026-10-09". This turns one into a sortable yyyymmdd number, with
// unknown parts as 0 (so a bare "2023" sorts before "January 2023"). Null if there's no year.

const MONTHS = ['january', 'february', 'march', 'april', 'may', 'june', 'july', 'august', 'september', 'october', 'november', 'december']

export function dateKey (text: string | null): number | null {
  if (text === null) return null
  const t = text.trim().toLowerCase()

  const iso = t.match(/^(\d{4})-(\d{1,2})(?:-(\d{1,2}))?$/)
  if (iso) return Number(iso[1]) * 10000 + Number(iso[2]) * 100 + Number(iso[3] ?? 0)

  const year = t.match(/\b(\d{4})\b/)
  if (year === null) return null
  // whole words only, full or abbreviated ("oct", "sept", "october"), so "mayhem" isn't May
  const words = t.split(/[^a-z]+/).filter(word => word.length >= 3)
  const month = MONTHS.findIndex(name => words.some(word => name.startsWith(word))) + 1
  const day = t.replace(year[0], '').match(/\b(\d{1,2})\b/)
  return Number(year[1]) * 10000 + month * 100 + (day ? Number(day[1]) : 0)
}
