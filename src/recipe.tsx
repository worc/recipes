import React, { useEffect, useState } from 'react'
import fm, { type FrontmatterResult } from 'frontmatter-js'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import styled from 'styled-components'

type Loaded =
  | { state: 'loading' }
  | { state: 'loaded', content: FrontmatterResult }
  | { state: 'failed', error: string }

function useRecipe (url: string): Loaded {
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

// Placeholder for the lab-notes pass: frontmatter as a plain definition list instead of JSON.
const Meta = styled.dl`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 2px 12px;
  margin: 0 0 16px;
  opacity: 0.7;

  dt { font-weight: 600; }
  dd { margin: 0; }
`

export default function Recipe ({ url }: { url: string }) {
  const loaded = useRecipe(url)

  if (loaded.state === 'loading') {
    return null
  }

  if (loaded.state === 'failed') {
    return <p>Couldn't load this recipe ({loaded.error}).</p>
  }

  const { frontmatter, body } = loaded.content
  const entries = Object.entries(frontmatter)

  return (
    <article>
      { entries.length > 0
        ? <Meta>
            { entries.map(([key, value]) => (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{Array.isArray(value) ? value.join(', ') : value}</dd>
              </React.Fragment>
            )) }
          </Meta>
        : null }
      <ReactMarkdown remarkPlugins={[ remarkGfm ]}>{body}</ReactMarkdown>
    </article>
  )
}
