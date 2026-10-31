import React from 'react'
import ReactMarkdown, { type Components } from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'
import { COLOR, FONT, hatch } from './theme'

// A leading amount on a list item: "600g", "4–6g", "~3 g", "½ cup", "2 cups", "1 quart", "3".
// Set in mono so the weights line up down an ingredient list and read as the measured part.
const QUANTITY = /^(~?\s?(?:\d[\d.,]*|[¼½¾⅓⅔⅛])(?:\s?[–-]\s?\d[\d.,]*)?\s?[¼½¾⅓⅔⅛]?\s?(?:fl oz|kg|mg|ml|g|l|lbs?|oz|tsp|tbsp|Tbsp|cups?|qt|quarts?|pints?|%)?)(?=[\s,(]|$)/

function splitQuantity (children: React.ReactNode): React.ReactNode {
  const list = React.Children.toArray(children)
  const first = list[0]
  if (typeof first !== 'string') return children
  const match = first.match(QUANTITY)
  if (match === null || match[1].trim() === '') return children
  return [
    <Quantity key='q'>{match[1].trim()}</Quantity>,
    first.slice(match[1].length),
    ...list.slice(1),
  ]
}

const components: Components = {
  li: ({ children }) => <li>{splitQuantity(children)}</li>,
  // wide lab-notebook tables scroll sideways inside the column instead of blowing out the page
  table: ({ children }) => <TableScroll><table>{children}</table></TableScroll>,
}

export default function Markdown ({ children }: { children: string }) {
  return (
    <Prose>
      <ReactMarkdown remarkPlugins={[ remarkGfm ]} components={components}>{children}</ReactMarkdown>
    </Prose>
  )
}

const Quantity = styled.span`
  font-family: ${FONT.mono};
  font-size: 0.9em;
  font-variant-numeric: tabular-nums;
  white-space: nowrap;
`

const TableScroll = styled.div`
  overflow-x: auto;
  margin: 1.2em 0;
  border-top: 2px solid ${COLOR.ink};
  border-bottom: 1px solid ${COLOR.ink};
`

export const Prose = styled.div`
  p, li { max-width: 70ch; }
  p { margin: 0.7em 0; }

  h2 {
    font-family: ${FONT.display};
    font-weight: 700;
    font-size: 1.6rem;
    line-height: 1.15;
    margin: 2.2em 0 0.6em;
    padding-bottom: 0.25em;
    border-bottom: 1px solid ${COLOR.ink};
    display: flex;
    align-items: baseline;
    gap: 0.45em;

    /* hatched swatch, like a map legend key */
    &::before {
      content: '';
      flex: none;
      width: 0.62em;
      height: 0.62em;
      border: 1px solid ${COLOR.turquoiseInk};
      background: ${hatch(COLOR.turquoiseInk, 4)};
    }
  }

  h3 {
    font-family: ${FONT.mono};
    font-size: 0.78rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: ${COLOR.muted};
    margin: 1.8em 0 0.5em;
  }

  h4 {
    font-size: 1rem;
    margin: 1.4em 0 0.4em;
  }

  ul, ol { padding-left: 1.4em; }
  li { margin: 0.25em 0; padding-left: 0.2em; }
  ul { list-style: square; }
  ul li::marker { color: ${COLOR.turquoise}; }
  ol li::marker {
    font-family: ${FONT.mono};
    font-size: 0.85em;
    color: ${COLOR.turquoiseInk};
  }
  li > p { margin: 0.2em 0; }

  /* section break: a hatched band, the strongest grouping on the page */
  hr {
    border: 0;
    height: 9px;
    margin: 2.6em 0;
    background: ${hatch(COLOR.turquoise, 5)};
    border-top: 1px solid ${COLOR.turquoise};
    border-bottom: 1px solid ${COLOR.turquoise};
  }

  /* blockquotes are margin notes, in ballpoint red */
  blockquote {
    margin: 1.2em 0;
    padding: 0.2em 0 0.2em 1em;
    border-left: 2px solid ${COLOR.red};
    color: ${COLOR.red};

    p { margin: 0.4em 0; }
    strong { color: inherit; }
  }

  del { color: ${COLOR.muted}; }

  code {
    font-family: ${FONT.mono};
    font-size: 0.88em;
    background: ${COLOR.hazeFaint};
    padding: 0.05em 0.3em;
  }

  img { max-width: 100%; height: auto; }

  /* size to content (each cell capped below) and scroll sideways, rather than crushing a
     12-column log into the text column */
  table {
    border-collapse: collapse;
    width: max-content;
    min-width: 100%;
    font-size: 0.9rem;
    font-variant-numeric: tabular-nums;
    line-height: 1.4;
  }
  th {
    font-family: ${FONT.mono};
    font-size: 0.7rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    text-align: left;
    vertical-align: bottom;
    color: ${COLOR.muted};
    padding: 0.55em 0.7em 0.45em;
    border-bottom: 1px solid ${COLOR.ink};
    white-space: nowrap;
  }
  td {
    padding: 0.5em 0.7em;
    vertical-align: top;
    border-bottom: 1px solid ${COLOR.rule};
    min-width: 6em;
    max-width: 22rem;
  }
  tr:last-child td { border-bottom: 0; }
  td:first-child, th:first-child { padding-left: 0; }

  /* a header row with nothing in it (key/value tables) */
  thead:not(:has(th:not(:empty))) { display: none; }

  /* pre-seeded rows waiting for the next batch: fill-in lines, like a paper log */
  tbody tr:not(:has(td:not(:empty))) td {
    height: 2.2em;
    border-bottom: 1px dashed ${COLOR.rule};
  }
`
