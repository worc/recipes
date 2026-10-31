import React from 'react'
import { Link, useLocation } from 'wouter'
import styled from 'styled-components'
import { NOTEBOOKS, RECIPES, type PageEntry } from './pages'
import { COLOR, FONT, WIDE } from './theme'

export default function Layout ({ children }: { children: React.ReactNode }) {
  return (
    <Shell>
      <Masthead>
        <Wordmark href='/'>recipes</Wordmark>
        <Tagline>stxalq.dev · recipe book &amp; notebooks</Tagline>
      </Masthead>
      <Columns>
        <Sidebar data-noprint aria-label='index'>
          <IndexGroup label='recipes' entries={RECIPES}/>
          <IndexGroup label='notebooks' entries={NOTEBOOKS}/>
        </Sidebar>
        <Main>{children}</Main>
      </Columns>
      <Footer data-noprint>
        <span>recipe book · <a href='https://stxalq.dev'>stxalq.dev</a></span>
        <span>source: <a href='https://github.com/worc/recipes'>worc/recipes</a></span>
      </Footer>
    </Shell>
  )
}

function IndexGroup ({ label, entries }: { label: string, entries: ReadonlyArray<PageEntry> }) {
  const [location] = useLocation()
  return (
    <Group>
      <GroupLabel>{label}<Count>{String(entries.length).padStart(2, '0')}</Count></GroupLabel>
      <ul>
        { entries.map(entry => (
          <li key={entry.path}>
            <Link href={entry.path} aria-current={location === entry.path ? 'page' : undefined}>{entry.name}</Link>
          </li>
        )) }
      </ul>
    </Group>
  )
}

const Shell = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  border-top: 6px solid ${COLOR.turquoise};
`

const Masthead = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.4rem 1rem;
  padding: 0.7rem clamp(1rem, 3vw, 2rem);
  border-bottom: 1px solid ${COLOR.ink};
`

const Wordmark = styled(Link)`
  font-family: ${FONT.display};
  font-weight: 700;
  font-size: 1.7rem;
  line-height: 1;
  color: ${COLOR.ink};
  text-decoration: none;

  &:hover { background: none; color: ${COLOR.turquoiseInk}; }
`

const Tagline = styled.span`
  font-family: ${FONT.mono};
  font-size: 0.72rem;
  color: ${COLOR.muted};
`

const Columns = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 2.5rem;
  width: 100%;
  max-width: 76rem;
  padding: 1.8rem clamp(1rem, 3vw, 2rem) 3rem;

  @media ${WIDE} {
    grid-template-columns: 13rem minmax(0, 1fr);
  }
`

// The home page is the index on narrow screens; the sidebar only shows when there's room.
const Sidebar = styled.nav`
  display: none;

  @media ${WIDE} {
    display: block;
    position: sticky;
    top: 1.5rem;
    align-self: start;
    max-height: calc(100vh - 3rem);
    overflow-y: auto;
  }
`

const Group = styled.section`
  margin-bottom: 1.8rem;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li { border-bottom: 1px solid ${COLOR.rule}; }

  a {
    display: block;
    padding: 0.32rem 0 0.32rem 0.7rem;
    color: ${COLOR.ink};
    text-decoration: none;
    border-left: 3px solid transparent;
  }

  a:hover { background: ${COLOR.hazeFaint}; }

  a[aria-current='page'] {
    border-left-color: ${COLOR.turquoise};
    background: ${COLOR.hazeFaint};
    font-weight: 700;
  }
`

export const GroupLabel = styled.h2`
  display: flex;
  justify-content: space-between;
  margin: 0;
  padding-bottom: 0.3rem;
  border-bottom: 2px solid ${COLOR.ink};
  font-family: ${FONT.mono};
  font-size: 0.72rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

export const Count = styled.span`
  color: ${COLOR.muted};
  font-weight: 400;
`

// capped so section rules and title block line up with the ~70ch prose; wide tables scroll inside it
const Main = styled.main`
  min-width: 0;
  max-width: 50rem;
`

const Footer = styled.footer`
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  padding: 0.8rem clamp(1rem, 3vw, 2rem);
  border-top: 1px solid ${COLOR.ink};
  font-family: ${FONT.mono};
  font-size: 0.72rem;
  color: ${COLOR.muted};
`
