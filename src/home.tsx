import React from 'react'
import { Link } from 'wouter'
import styled from 'styled-components'
import { FEATURED, NOTEBOOKS, RECIPES, pageNumber, type PageEntry } from './pages'
import { HOME_TITLE, KIND_LABEL, SITE, type PageSummary } from './meta'
import { SUMMARIES, summaryFor } from './summaries'
import { dateKey } from './dates'
import { useDocumentTitle } from './document_title'
import { Count, GroupLabel } from './layout'
import { COLOR, FONT, WIDE, hatch } from './theme'

const LIST_LENGTH = 5

// Pages with a parseable `last update`, newest first.
function byLastUpdate (): Array<PageSummary & { key: number }> {
  return SUMMARIES
    .map(summary => ({ ...summary, key: dateKey(summary.lastUpdate) }))
    .filter((summary): summary is PageSummary & { key: number } => summary.key !== null)
    .sort((a, b) => b.key - a.key)
}

export default function Home () {
  useDocumentTitle(HOME_TITLE)
  const dated = byLastUpdate()

  return (
    <>
      <Intro>{SITE.description}</Intro>

      <Featured>
        { FEATURED.map(entry => <FeatureCard key={entry.path} entry={entry}/>) }
      </Featured>

      <Lists>
        <DateList label='recently updated' summaries={dated.slice(0, LIST_LENGTH)}/>
        <DateList label='longest untouched' summaries={dated.slice(-LIST_LENGTH).reverse()}/>
      </Lists>

      {/* the sidebar is the full index on wide screens; on narrow ones it lives here instead */}
      <NarrowOnly>
        <IndexSection label='recipes' entries={RECIPES}/>
        <IndexSection label='notebooks' entries={NOTEBOOKS}/>
      </NarrowOnly>
    </>
  )
}

function FeatureCard ({ entry }: { entry: PageEntry }) {
  const summary = summaryFor(entry.path)
  return (
    <Card href={entry.path}>
      <CardStrip>
        <span><Swatch aria-hidden/>{KIND_LABEL[entry.kind]}</span>
        <span>no. {String(pageNumber(entry)).padStart(2, '0')}</span>
      </CardStrip>
      <CardTitle>{summary?.title ?? entry.name}</CardTitle>
      { summary?.description ? <CardText>{summary.description}</CardText> : null }
      <CardDates>
        { summary?.originalDate ? <div>first written · {summary.originalDate}</div> : null }
        { summary?.lastUpdate ? <div>last update · {summary.lastUpdate}</div> : null }
      </CardDates>
    </Card>
  )
}

function DateList ({ label, summaries }: { label: string, summaries: ReadonlyArray<PageSummary> }) {
  return (
    <section>
      <GroupLabel>{label}</GroupLabel>
      <Rows>
        { summaries.map(summary => (
          <li key={summary.path}>
            <Link href={summary.path}>
              <Name>{summary.name}</Name>
              <Meta>{summary.lastUpdate} · {KIND_LABEL[summary.kind]}</Meta>
            </Link>
          </li>
        )) }
      </Rows>
    </section>
  )
}

function IndexSection ({ label, entries }: { label: string, entries: ReadonlyArray<PageEntry> }) {
  return (
    <section>
      <GroupLabel>{label}<Count>{String(entries.length).padStart(2, '0')}</Count></GroupLabel>
      <Rows>
        { entries.map(entry => (
          <li key={entry.path}>
            <Link href={entry.path}>
              <Name>{entry.name}</Name>
              <Meta>{entry.path}</Meta>
            </Link>
          </li>
        )) }
      </Rows>
    </section>
  )
}

const Intro = styled.p`
  max-width: 60ch;
  margin: 0 0 2rem;
  font-family: ${FONT.display};
  font-size: 1.35rem;
  line-height: 1.35;
`

const Featured = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(14rem, 1fr));
  gap: 1rem;
  margin-bottom: 2.6rem;
`

const Card = styled(Link)`
  display: flex;
  flex-direction: column;
  border: 1.5px solid ${COLOR.ink};
  background: ${COLOR.paper};
  color: ${COLOR.ink};
  text-decoration: none;

  &:hover { background: ${COLOR.hazeFaint}; }
  &:hover h2 { color: ${COLOR.turquoiseInk}; }
`

const CardStrip = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 0.35rem 0.7rem;
  border-bottom: 1px solid ${COLOR.ink};
  font-family: ${FONT.mono};
  font-size: 0.66rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${COLOR.muted};

  span:first-child {
    display: inline-flex;
    align-items: center;
    gap: 0.5em;
    font-weight: 600;
    color: ${COLOR.ink};
  }
`

const Swatch = styled.span`
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  border: 1px solid ${COLOR.turquoiseInk};
  background: ${hatch(COLOR.turquoiseInk, 3)};
`

const CardTitle = styled.h2`
  margin: 0;
  padding: 0.6rem 0.7rem 0.3rem;
  font-family: ${FONT.display};
  font-size: 1.55rem;
  line-height: 1.05;
`

// no flex-grow here: a stretched box shows a fifth, half-cut line under the clamp
const CardText = styled.p`
  margin: 0 0.7rem 0.7rem;
  padding: 0;
  font-size: 0.88rem;
  line-height: 1.45;
  color: ${COLOR.muted};
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
`

const CardDates = styled.div`
  margin-top: auto;
  padding: 0.35rem 0.7rem;
  border-top: 1px solid ${COLOR.rule};
  font-family: ${FONT.mono};
  font-size: 0.7rem;
  color: ${COLOR.muted};
`

const Lists = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1.2rem 2rem;
  margin-bottom: 2.6rem;
`

const NarrowOnly = styled.div`
  display: grid;
  gap: 2.2rem;

  @media ${WIDE} { display: none; }
`

const Rows = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li { border-bottom: 1px solid ${COLOR.rule}; }

  a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    flex-wrap: wrap;
    gap: 0.2rem 1rem;
    padding: 0.45rem 0.1rem;
    color: ${COLOR.ink};
    text-decoration: none;
  }

  a:hover { background: ${COLOR.hazeFaint}; }
  a:hover span:first-child { color: ${COLOR.turquoiseInk}; text-decoration: underline; text-underline-offset: 3px; }
`

const Name = styled.span`
  font-family: ${FONT.display};
  font-size: 1.2rem;
  font-weight: 700;
  line-height: 1.15;
`

const Meta = styled.span`
  font-family: ${FONT.mono};
  font-size: 0.7rem;
  color: ${COLOR.muted};
`
