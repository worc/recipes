import React, { useEffect, useState } from 'react'
import fm, { type FrontmatterResult } from 'frontmatter-js'
import styled from 'styled-components'
import Markdown from './markdown'
import TitleBlock from './title_block'
import { pageTitle, splitTitle } from './meta'
import { useDocumentTitle } from './document_title'
import { summaryFor } from './summaries'
import type { PageEntry } from './pages'
import { COLOR, FONT } from './theme'

type Loaded =
  | { state: 'loading' }
  | { state: 'loaded', content: FrontmatterResult }
  | { state: 'failed', error: string }

function useMarkdown (url: string): Loaded {
  const [loaded, setLoaded] = useState<Loaded>({ state: 'loading' })

  useEffect(() => {
    const controller = new AbortController()
    setLoaded({ state: 'loading' })

    fetch(url, { signal: controller.signal })
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status} ${response.statusText}`)
        }
        return response.text()
      })
      .then(text => setLoaded({ state: 'loaded', content: fm({ content: text }) }))
      .catch((error: Error) => {
        if (error.name !== 'AbortError') {
          setLoaded({ state: 'failed', error: error.message })
        }
      })

    return () => controller.abort()
  }, [url])

  return loaded
}

export default function Page ({ entry }: { entry: PageEntry }) {
  const loaded = useMarkdown(entry.markdown)
  const split = loaded.state === 'loaded' ? splitTitle(loaded.content.body) : null
  // the embedded summary already knows the title, so the title block doesn't change once the markdown lands
  const title = split?.title ?? summaryFor(entry.path)?.title ?? entry.name

  useDocumentTitle(pageTitle(title))

  return (
    <article>
      <TitleBlock
        entry={entry}
        title={title}
        frontmatter={loaded.state === 'loaded' ? loaded.content.frontmatter : undefined}
      />
      { loaded.state === 'failed'
        ? <Failed>Couldn't load this page ({loaded.error}).</Failed>
        : null }
      { split !== null ? <Markdown>{split.rest}</Markdown> : null }
    </article>
  )
}

const Failed = styled.p`
  font-family: ${FONT.mono};
  color: ${COLOR.red};
`
