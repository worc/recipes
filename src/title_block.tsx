import React from 'react'
import styled from 'styled-components'
import { COLOR, FONT, hatch } from './theme'
import { KIND_LABEL } from './meta'
import { pageNumber, type PageEntry } from './pages'

interface Props {
  entry: PageEntry
  title: string
  frontmatter?: Record<string, string | string[]>
}

// The page header, modeled on the title block in the corner of an engineering drawing:
// what it is, its number, its name, then the dated fields in labeled cells.
export default function TitleBlock ({ entry, title, frontmatter = {} }: Props) {
  const cells = Object.entries(frontmatter)
  const number = String(pageNumber(entry)).padStart(2, '0')

  return (
    <Block>
      <Strip>
        <Kind><Swatch aria-hidden/>{KIND_LABEL[entry.kind]}</Kind>
        <Ref>no. {number} · {entry.path}</Ref>
      </Strip>
      <Title>{title}</Title>
      { cells.length > 0
        ? <Cells>
            { cells.map(([key, value]) => (
              <Cell key={key}>
                <dt>{key}</dt>
                <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
              </Cell>
            )) }
          </Cells>
        : null }
    </Block>
  )
}

const Block = styled.header`
  border: 1.5px solid ${COLOR.ink};
  margin: 0 0 2rem;
  background: ${COLOR.paper};
`

const Strip = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding: 0.4rem 0.8rem;
  border-bottom: 1px solid ${COLOR.ink};
  font-family: ${FONT.mono};
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
`

const Kind = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  font-weight: 600;
`

const Swatch = styled.span`
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  border: 1px solid ${COLOR.turquoiseInk};
  background: ${hatch(COLOR.turquoiseInk, 3)};
`

const Ref = styled.span`
  color: ${COLOR.muted};
  text-transform: none;
  letter-spacing: 0.02em;
`

const Title = styled.h1`
  font-family: ${FONT.display};
  font-weight: 700;
  font-size: clamp(2rem, 6vw, 2.9rem);
  line-height: 1.02;
  margin: 0;
  padding: 0.9rem 0.8rem 1rem;
`

const Cells = styled.dl`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
  margin: 0;
  border-top: 1px solid ${COLOR.ink};
`

const Cell = styled.div`
  padding: 0.4rem 0.8rem 0.5rem;
  box-shadow: -1px 0 0 ${COLOR.ink};

  dt {
    font-family: ${FONT.mono};
    font-size: 0.66rem;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${COLOR.muted};
  }

  dd {
    margin: 0.1rem 0 0;
    font-family: ${FONT.mono};
    font-size: 0.9rem;
  }
`
